import { db } from './src/db';
import { assets, documents } from './src/db/schema';

async function seed() {
  const insertedAssets = await db.insert(assets).values([
    {
      name: 'Turbine Generator A',
      type: 'Generator',
      location: 'Plant 1, Sector 4',
      status: 'operational',
      description: 'Primary steam turbine generator for Sector 4.',
    },
    {
      name: 'Conveyor Belt System 2',
      type: 'Transport',
      location: 'Warehouse B',
      status: 'maintenance',
      description: 'Main conveyor belt, currently undergoing routine belt replacement.',
    },
    {
      name: 'Hydraulic Press HP-01',
      type: 'Heavy Machinery',
      location: 'Assembly Line A',
      status: 'operational',
      description: '500-ton hydraulic press used for chassis forming.',
    }
  ]).returning();

  await db.insert(documents).values([
    {
      assetId: insertedAssets[0].id,
      filename: 'Turbine_Manual_v2.pdf',
      s3Url: '/mock/s3/Turbine_Manual_v2.pdf',
      format: 'pdf',
      status: 'indexed'
    },
    {
      assetId: insertedAssets[1].id,
      filename: 'Conveyor_Belt_Replacement_SOP.docx',
      s3Url: '/mock/s3/Conveyor_SOP.docx',
      format: 'text',
      status: 'indexed'
    },
    {
      assetId: insertedAssets[2].id,
      filename: 'Hydraulic_Press_Specs.pdf',
      s3Url: '/mock/s3/Hydraulic_Press_Specs.pdf',
      format: 'pdf',
      status: 'processing'
    }
  ]);

  console.log('Database seeded with sample assets and documents!');
}

seed().catch(console.error);
