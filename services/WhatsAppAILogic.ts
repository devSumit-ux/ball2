import { generateChatResponse, processPrescription, checkOllamaStatus } from './ollamaService';

/**
 * Logic for WhatsApp AI chat simulation
 */

export interface WhatsAppMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
  isPrescription?: boolean;
  image?: string;
}

/**
 * Handle an incoming WhatsApp message and get AI response
 */
export async function handleWhatsAppMessage(message: string, context?: any, history: any[] = [], image?: string): Promise<string> {
  const isOllamaRunning = await checkOllamaStatus();
  
  if (!isOllamaRunning) {
    return "I'm sorry, I'm currently offline. (Ollama not detected)";
  }

  // EYES: If an image is provided, let Llava "see" it first
  let visualInsight = "";
  if (image) {
    try {
      const llavaOutput = await processPrescription(image);
      visualInsight = `\n[EYES: VISUAL_ANALYSIS]\nFound in image: ${llavaOutput}\n[/EYES]\n`;
    } catch (err: any) {
      console.warn("Vision error:", err);
      visualInsight = `\n[EYES: VISION_ERROR]\nThe camera system is having trouble. Ask the user if 'llava' is installed in Ollama.\n[/EYES]\n`;
    }
  }

  const appStateContext = context ? `
CURRENT APP STATE:
- User: ${context.user?.name || 'Unknown'}
- Cart: ${context.cart?.length ? context.cart.map((c: any) => `${c.qty}x ${c.product.name}`).join(', ') : 'Empty'}
- Pending Bookings: ${context.bookings?.length || 0}
- Health Records: ${context.records?.length || 0}
` : '';

  const systemPrompt = `You are Pharmelo AI (Solan, HP). 
Role: Professional Pharmacy Assistant & Ecosystem Guide.
${appStateContext}
${visualInsight}
Instructions:
- Use *Exactly One Asterisk* for bolding (e.g., *Paracetamol*).
- Use professional emojis (💊, 🏥, ✅, 👨‍⚕️).
- ABSOLUTE LIMIT: Max 2 short sentences.
- Be direct. No filler phrases like "I've detected" or "Based on".
- IF VISUAL_ANALYSIS IS PRESENT: Discuss the medicines found naturally. (e.g., "I've checked the image! Shall I add *Medicine Name* to your cart?").
- IF VISION_ERROR IS PRESENT: Apologize and guide the user to check their Ollama 'llava' installation. 
- NAME CHANGES: If requested, output CHANGE_NAME: [New Name].
- DOCTOR BOOKINGS: Ask for 1. Name, 2. Date, 3. Time, 4. Cause. 
- CONFIRMATION: Only output APPOINTMENT_CONFIRMED: [Doc|Date|Time|Cause] when all 4 are known.
- ORDERS: Only output ORDER_CONFIRMED: [Items] when final.
Example: *Paracetamol* found in Rx. Shall I add it to cart? ✅`;
  
  const historyPrompt = history.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`).join('\n');
  const fullPrompt = `${systemPrompt}\n\n${historyPrompt}\nUser: ${message}\nAI:`;
  
  return await generateChatResponse(fullPrompt);
}

/**
 * Handle a prescription upload through WhatsApp chat
 */
export async function handleWhatsAppPrescription(base64Image: string): Promise<{ medicines: string[], response: string }> {
  const aiResponse = await processPrescription(base64Image);
  
  // Basic parsing logic (can be improved)
  const medicines = aiResponse.split('\n').filter(line => line.trim().length > 0);
  
  return {
    medicines,
    response: aiResponse
  };
}

/**
 * AI Logic Functions requested by the user
 */
export const WhatsAppAILogic = {
  processIncoming: handleWhatsAppMessage,
  processImage: handleWhatsAppPrescription,
  checkStatus: checkOllamaStatus
};
