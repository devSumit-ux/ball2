import { WhatsAppAILogic } from './services/WhatsAppAILogic';

async function test() {
  console.log('--- Testing Refined Professional AI ---');
  const isRunning = await WhatsAppAILogic.checkStatus();
  console.log('Ollama Running:', isRunning);

  if (isRunning) {
    console.log('\n--- Testing Minimalistic Response ---');
    try {
      const response = await WhatsAppAILogic.processIncoming('I want to order Paracetamol 500mg.');
      console.log('AI Response:', response);
      
      console.log('\n--- Testing Formatted Response ---');
      const mockContext2 = {
        user: { name: 'Binay' },
        cart: [{ qty: 1, product: { name: 'Amoxicillin' } }, { qty: 2, product: { name: 'Paracetamol' } }],
        bookings: [],
        records: []
      };
      const response5 = await WhatsAppAILogic.processIncoming('What medicines are in my cart and who is Dr. Rajesh?', mockContext2);
      console.log('AI Response:', response5);
    } catch (e) {
      console.error('Test failed:', e);
    }
  } else {
    console.log('Please start Ollama to run the test.');
  }
  console.log('--- End of Test ---');
}

test();
