import express from 'express';
import { eq } from 'drizzle-orm';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { router } from './trpc';
import { assetsRouter } from './routers/assets';
import { documentsRouter } from './routers/documents';
import { qaRouter } from './routers/qa';
import multer from 'multer';
import { db } from './db';
import { documents } from './db/schema';
import path from 'path';
import fs from 'fs';

const appRouter = router({
  assets: assetsRouter,
  documents: documentsRouter,
  qa: qaRouter,
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());

// Configure Multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

// File upload endpoint
app.post('/upload', upload.single('document'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const ext = path.extname(req.file.originalname).substring(1).toUpperCase() || 'UNKNOWN';
  
  try {
    let safeFormat = ext.toLowerCase();
    if (safeFormat !== 'pdf' && safeFormat !== 'text') {
      safeFormat = 'text'; // Fallback to match enum
    }

    const newDoc = await db.insert(documents).values({
      filename: req.file.originalname,
      format: safeFormat as 'pdf' | 'text',
      s3Url: req.file.path,
      status: 'indexed', 
    }).returning();
    
    res.json({ success: true, document: newDoc[0] });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// File download endpoint
app.get('/api/download/:id', async (req, res) => {
  try {
    const docId = parseInt(req.params.id);
    if (isNaN(docId)) return res.status(400).send('Invalid ID');
    
    const docs = await db.select().from(documents).where(eq(documents.id, docId));
    const doc = docs[0];
    
    if (!doc || !doc.s3Url || !fs.existsSync(doc.s3Url)) {
      return res.status(404).send('File not found');
    }
    
    res.download(doc.s3Url, doc.filename);
  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).send('Server Error');
  }
});

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

// Serve frontend static files in production
const clientDistPath = path.join(process.cwd(), '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  
  // Catch-all route for SPA routing
  app.get(/^(.*)$/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 7860;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
