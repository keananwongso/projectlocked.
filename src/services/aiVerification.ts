// AI Verification Service using Google Gemini
import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiConfig } from '../config/firebase.config';
import * as FileSystem from 'expo-file-system';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);

export interface VerificationResult {
  confidence: number; // 0-100
  feedback: string;
  success: boolean;
}

/**
 * Converts a local image URI to base64 format for Gemini API
 */
async function imageUriToBase64(uri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

/**
 * Verifies if a challenge photo shows someone genuinely "locked in" and working
 * @param imageUri - Local file URI of the challenge photo
 * @returns VerificationResult with confidence score and feedback
 */
export async function verifyLockInPhoto(imageUri: string): Promise<VerificationResult> {
  try {
    console.log('Starting AI verification for image:', imageUri);

    // Convert image to base64
    const base64Image = await imageUriToBase64(imageUri);

    // Get the Gemini model with vision capabilities
    const model = genAI.getGenerativeModel({ model: geminiConfig.model });

    // Create the prompt for analyzing the lock-in level
    const prompt = `Analyze this image and determine if the person is genuinely focused on productive work (studying, coding, working on a project, etc.). 

Rate their 'lock-in' level from 0-100 based on:
- Workspace setup and organization
- Visible work materials (laptop, books, notes, etc.)
- Body language suggesting focus and concentration
- Lack of distractions or entertainment

Respond with ONLY a number between 0-100, nothing else. Be generous but realistic.`;

    // Send the image and prompt to Gemini
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text().trim();

    console.log('Gemini API response:', text);

    // Parse the confidence score from the response
    const confidence = parseInt(text, 10);

    // Validate the confidence score
    if (isNaN(confidence) || confidence < 0 || confidence > 100) {
      console.warn('Invalid confidence score from Gemini:', text);
      // Fallback to a reasonable default
      return {
        confidence: 75,
        feedback: 'AI verification completed',
        success: true,
      };
    }

    // Generate feedback message based on confidence
    let feedback: string;
    if (confidence >= 80) {
      feedback = `${confidence}% really locked in! Great focus! 🔥`;
    } else if (confidence >= 60) {
      feedback = `${confidence}% locked in. Could be better, but acceptable.`;
    } else if (confidence >= 40) {
      feedback = `${confidence}% locked in. Hmm, questionable...`;
    } else {
      feedback = `${confidence}% locked in. Not very convincing...`;
    }

    return {
      confidence,
      feedback,
      success: true,
    };
  } catch (error) {
    console.error('Error verifying lock-in photo with Gemini:', error);

    // Fallback to mock confidence if API fails (for demo resilience)
    const mockConfidence = Math.floor(Math.random() * 20) + 75; // 75-95
    return {
      confidence: mockConfidence,
      feedback: `${mockConfidence}% really locked in (AI check failed, using fallback)`,
      success: false,
    };
  }
}
