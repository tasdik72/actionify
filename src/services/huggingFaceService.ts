const HF_TOKEN = import.meta.env.VITE_HF_TOKEN as string;

export const analyzeSentimentHF = async (text: string) => {
  if (!HF_TOKEN) {
    throw new Error('Missing VITE_HF_TOKEN. Please set it in your environment.');
  }
  const response = await fetch(
    'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Hugging Face API error: ${response.status} ${response.statusText} ${errText}`);
  }

  return response.json();
};

