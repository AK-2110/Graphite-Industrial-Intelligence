import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const qaRouter = router({
  ask: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ input }) => {
      // Simulate network delay for AI response
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const queryLower = input.query.toLowerCase();
      
      let answer = "I found some information in the technical manuals. ";
      
      if (queryLower.includes('vibration') || queryLower.includes('turbine')) {
        answer += "Based on 'Turbine Manual v2.pdf', a vibration exceeding 15mm/s on the bearing indicates critical wear. Immediate shutdown and inspection is recommended. Ensure the cooling system is offline before disassembling the housing.";
      } else if (queryLower.includes('temperature') || queryLower.includes('hydraulic')) {
        answer += "According to the Hydraulic Press Maintenance SOP, if the fluid temperature reaches 85°C, you should check the heat exchanger coils for blockages and ensure the coolant flow rate is at least 50 L/min.";
      } else {
        answer = "I've searched the knowledge base, but I need more specific terms to give you an accurate procedure. Are you asking about a specific asset like the Turbine Generator or the Hydraulic Press?";
      }

      return {
        answer,
        sources: ['Turbine Manual v2.pdf', 'Hydraulic Press Maintenance SOP']
      };
    }),

  analyzeNode: publicProcedure
    .input(z.object({
      nodeId: z.string(),
      nodeLabel: z.string(),
      nodeType: z.string(),
      action: z.enum(['root_cause', 'summarize'])
    }))
    .mutation(async ({ input }) => {
      // Simulate network delay for AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      let result = '';
      
      if (input.action === 'root_cause') {
        if (input.nodeLabel.toLowerCase().includes('vibration')) {
          result = `**Root Cause Analysis for [${input.nodeLabel}]**\n\n1. **Primary Anomaly:** Vibration exceeding 15mm/s threshold at the bearing housing.\n2. **Historical Correlation:** Matches a similar incident from Q2 2023 caused by bearing misalignment due to uneven thermal expansion.\n3. **Recommended Action:** Immediate shutdown required. Inspect bearing alignment and recalibrate thermal sensors as per the Turbine OEM Manual.`;
        } else {
          result = `**Root Cause Analysis for [${input.nodeLabel}]**\n\nNo immediate critical anomalies detected. However, routine wear-and-tear on this ${input.nodeType} may lead to degraded performance. Schedule a standard inspection within 14 days.`;
        }
      } else if (input.action === 'summarize') {
        result = `**Context Summary for [${input.nodeLabel}]**\n\nThis is a critical ${input.nodeType} entity within the industrial network. It has 3 direct dependencies and is currently tagged with a severity status. Based on ingested documentation, it was last inspected 6 months ago.`;
      }

      return { result };
    }),
});
