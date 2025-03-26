
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { images, topics, difficulty, questionCount } = await req.json();
    
    if (!images || !images.length) {
      throw new Error('No images provided');
    }

    console.log(`Processing request: ${questionCount} questions, ${images.length} images, difficulty: ${difficulty}`);
    
    // Calculate the number of questions to generate per image
    const totalImages = images.length;
    const questionsPerImage = Math.ceil(questionCount / totalImages);
    const questionsToGenerate = [];
    
    console.log(`Generating ${questionCount} questions using ${totalImages} images (approx. ${questionsPerImage} questions per image)`);

    // Create an array of question generation tasks
    for (let i = 0; i < questionCount; i++) {
      // Cycle through available images if more questions than images
      const imageIndex = i % totalImages;
      const imageUrl = images[imageIndex];
      
      questionsToGenerate.push({
        imageUrl,
        questionIndex: i
      });
    }
    
    // Process all questions
    const questionPromises = questionsToGenerate.map(({ imageUrl, questionIndex }) => 
      generateQuestion(imageUrl, topics, difficulty, questionIndex)
    );
    
    // Wait for all questions to be generated
    const generatedQuestions = await Promise.all(questionPromises);
    
    // Filter out any failed questions
    const validQuestions = generatedQuestions.filter(q => q !== null);
    
    if (validQuestions.length === 0) {
      throw new Error('Failed to generate any questions');
    }

    console.log(`Successfully generated ${validQuestions.length} questions`);
    return new Response(JSON.stringify({ questions: validQuestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Function to generate a single question
async function generateQuestion(imageUrl, topics, difficulty, questionIndex) {
  console.log(`Generating question ${questionIndex + 1} from image`);
  
  try {
    // Make the question topic more varied if generating multiple questions from the same image
    const topicPrompt = topics.length > 0 
      ? `The question should relate to one of these topics if possible: ${topics.join(', ')}.` 
      : 'Create a diverse range of questions covering different aspects of the image.';
    
    // Add variety instruction for multiple questions from the same image
    const varietyPrompt = `Make this question unique and different from other questions about the same image. 
                          Focus on different aspects, details, or interpretations of the image.`;
    
    // Call OpenAI API to generate a question for this image
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating engaging memory game questions based on images.
            Generate a multiple-choice question for a memory game with 4 answer options, where only 1 is correct.
            The game is for ${difficulty} difficulty level. 
            ${topicPrompt}
            ${varietyPrompt}
            Format the response as a JSON object with the following schema:
            {
              "question": "Question text here",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctAnswer": 0 // Index of the correct answer (0-3)
            }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Generate question #${questionIndex + 1} based on this image.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        temperature: 0.8, // Increased temperature for more variety
        max_tokens: 500,
      }),
    });

    const data = await openaiResponse.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }

    // Parse the JSON response from GPT
    const content = data.choices[0].message.content.trim();
    console.log('Raw response from OpenAI:', content);
    
    try {
      const parsedQuestion = JSON.parse(content);
      
      // Add to questions array with image URL and unique ID
      return {
        id: `q-${Date.now()}-${questionIndex}`,
        imageUrl: imageUrl,
        ...parsedQuestion
      };
      
    } catch (parseError) {
      console.error('Error parsing question JSON:', parseError);
      console.log('Raw content:', content);
      
      // Try to extract JSON from the content if it's embedded in text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = jsonMatch[0];
          const parsedQuestion = JSON.parse(extractedJson);
          return {
            id: `q-${Date.now()}-${questionIndex}`,
            imageUrl: imageUrl,
            ...parsedQuestion
          };
        } catch (extractError) {
          console.error('Failed to extract embedded JSON:', extractError);
        }
      }
    }
    
    return null; // Return null if parsing failed
  } catch (error) {
    console.error(`Error generating question ${questionIndex + 1}:`, error);
    return null; // Return null if generation failed
  }
}
