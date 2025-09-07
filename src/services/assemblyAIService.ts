import axios from 'axios';

// Note: The environment variable name has an underscore: VITE_ASSEMBLY_AI_API_KEY
const ASSEMBLY_AI_API_KEY = import.meta.env.VITE_ASSEMBLY_AI_API_KEY as string;
const BASE_URL = 'https://api.assemblyai.com';

const headers = {
  authorization: ASSEMBLY_AI_API_KEY,
};


export interface TranscriptionResult {
  id: string;
  text: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
    speaker?: string;
  }>;
  speakers?: string[];
  error?: string;
}

export const uploadAudioToAssemblyAI = async (audioUrl: string): Promise<string> => {
  try {
    if (!ASSEMBLY_AI_API_KEY) {
      throw new Error('Missing VITE_ASSEMBLYAI_API_KEY. Please set it in your environment.');
    }
    const uploadResponse = await axios.post(`${BASE_URL}/v2/upload`, audioUrl, {
      headers,
    });
    return uploadResponse.data.upload_url;
  } catch (error) {
    console.error('Error uploading to AssemblyAI:', error);
    throw error;
  }
};

export const startTranscription = async (audioUrl: string): Promise<string> => {
  try {
    if (!ASSEMBLY_AI_API_KEY) {
      throw new Error('Missing VITE_ASSEMBLYAI_API_KEY. Please set it in your environment.');
    }
    const data = {
      audio_url: audioUrl,
      speech_model: 'universal',
      speaker_labels: true,
      speakers_expected: 4, // Adjust based on your needs
    };

    const response = await axios.post(`${BASE_URL}/v2/transcript`, data, { headers });
    return response.data.id;
  } catch (error) {
    console.error('Error starting transcription:', error);
    throw error;
  }
};

export const getTranscriptionStatus = async (transcriptId: string): Promise<TranscriptionResult> => {
  try {
    if (!ASSEMBLY_AI_API_KEY) {
      throw new Error('Missing VITE_ASSEMBLYAI_API_KEY. Please set it in your environment.');
    }
    const response = await axios.get(`${BASE_URL}/v2/transcript/${transcriptId}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting transcription status:', error);
    throw error;
  }
};

export const pollTranscription = async (
  transcriptId: string,
  onProgress?: (status: string) => void
): Promise<TranscriptionResult> => {
  const pollingEndpoint = `${BASE_URL}/v2/transcript/${transcriptId}`;

  while (true) {
    try {
      if (!ASSEMBLY_AI_API_KEY) {
        throw new Error('Missing VITE_ASSEMBLYAI_API_KEY. Please set it in your environment.');
      }
      const response = await axios.get(pollingEndpoint, { headers });
      const result = response.data;

      if (onProgress) {
        onProgress(result.status);
      }

      if (result.status === 'completed') {
        return result;
      } else if (result.status === 'error') {
        throw new Error(`Transcription failed: ${result.error}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Error polling transcription:', error);
      throw error;
    }
  }
};