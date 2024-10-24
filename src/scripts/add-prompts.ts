import "server-only";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { utapi } from "@/lib/clients";

const db = new PrismaClient();

const Prompt = z.object({
  description: z.string(),
});

const openai = new OpenAI();

const systemPrompt = `
Process Overview

	1.	Analyze the Image: Identify key elements—actions, attire, setting, and mood.
	2.	Determine the Desired Photo Style: Decide on the artistic style (e.g., hyper-realistic, anime).
	3.	Replace the Subject with “TOK”: Use “TOK” as the main subject, adjusting descriptions accordingly.
	4.	Extract Components: Break down the image into predefined categories.
	5.	Construct the Prompt: Organize the information using the provided template, emphasizing the photo style.
	6.	Review and Refine: Ensure clarity, completeness, and adherence to the instructions.

Detailed Instructions

1. Analyze the Image

	•	Observe the image to identify the main subject’s actions, attire, and emotional state.
	•	Note the setting, background elements, and any significant objects or features.
	•	Pay attention to the mood and atmosphere conveyed.

2. Determine the Desired Photo Style

	•	Choose the artistic style for the output. Be emphatic and specific.
	•	Styles can include, but are not limited to:
	•	Hyper-Realistic Photography
	•	Vintage 1920s Style
	•	Anime Style
	•	Watercolor Painting
	•	Black and White Photography
	•	Cyberpunk Art
	•	Pop Art
	•	Surrealism
	•	Comic Book Style
	•	Impressionist Painting
	•	Pixel Art
	•	Minimalist Art
	•	Steampunk Style
	•	Oil Painting
	•	Abstract Art
	•	Gothic Art
	•	Art Deco Style
	•	Fantasy Art
	•	Photorealism
	•	Digital Illustration
	•	Noir Style
	•	Graffiti Art
	•	Retro Futurism
	•	Chibi Style
	•	Neon Art
	•	Typography Art
	•	Manga Style
	•	Cartoon Style
	•	Ink Wash Painting (Sumi-e)
	•	Concept Art
	•	Pointillism
	•	Art Nouveau
	•	Cubism
	•	Retro 80s Synthwave

3. Replace the Subject with “TOK”

	•	Use “TOK” as the subject, matching the gender and adjusting pronouns.
	•	Do not describe physical features specific to the original person; rely on “TOK” for appearance.

4. Extract Components

Organize the information into the following categories:

	1.	Trigger Word: "TOK"
	2.	Image Inspiration:
	•	Description: Provide a concise description of the scene, excluding the original person’s identity.
	3.	Subject:
	•	Description: "TOK" (the trained model person).
	•	Action: Describe what “TOK” is doing, based on the original image.
	•	Emotional State: Mention “TOK”’s expression or mood.
	4.	Appearance:
	•	Clothing: Describe the attire from the image that “TOK” is wearing.
	•	Accessories: Include any accessories present.
	5.	Setting/Background:
	•	Location: Specify the environment.
	•	Background Elements: Note significant details.
	6.	Style/Artistic Direction:
	•	Specify the Desired Photo Style: Clearly state the artistic style (e.g., “Depict this scene in a hyper-realistic photography style”).
	•	Mood and Aesthetics: Describe color palettes, lighting, and techniques relevant to the style.
	7.	Additional Elements:
	•	Include any other important details, such as branding or specific objects.

5. Construct the Prompt

Using the extracted components, construct a cohesive prompt following this structure:

Example:
TOK

[Image Inspiration]
"A [brief description of the scene]."

[Subject]
"TOK is [action], with a [emotional state] expression."

[Appearance]
"Clothing: [describe attire]. Accessories: [describe accessories]."

[Setting/Background]
"Location: [describe environment]. Background elements: [describe significant details]."

[Style/Artistic Direction]
"Depict this scene in a [specific style], emphasizing [details about mood, lighting, and techniques]."

[Additional Elements]
"Include [any other important details]."

6. Review and Refine

	•	Clarity: Ensure all components are clearly described.
	•	Consistency: Use consistent terminology and pronouns.
	•	Completeness: Verify that all relevant details from the image are included.
	•	Emphasis on Style: Make sure the desired photo style is specified emphatically.

Example Prompt:
Given Image Description:

An image shows a person playing the piano on a stage under bright spotlight, with a grand concert hall in the background. The audience is visible in dim lighting, and the atmosphere is elegant and formal.

Assuming “TOK” is female, and the desired style is “Oil Painting”.

Constructed Prompt:
TOK

[Image Inspiration]
"A grand concert hall where a pianist is performing on stage under a bright spotlight, with an elegant audience seated in dim lighting."

[Subject]
"TOK is playing the piano gracefully, with a focused and passionate expression."

[Appearance]
"Clothing: Wearing an elegant, floor-length evening gown in deep blue satin. Accessories: Delicate silver jewelry and matching heels."

[Setting/Background]
"Location: On stage in a grand concert hall. Background elements: Ornate architectural details, velvet curtains, attentive audience."

[Style/Artistic Direction]
"Depict this scene in an oil painting style, emphasizing rich textures and deep, vibrant colors. Use dramatic lighting to highlight TOK and create a contrast between the illuminated stage and the darker audience. Brushstrokes should be visible, adding depth and realism."

[Additional Elements]
"Include subtle reflections on the polished piano surface and capture the emotion of the performance."

Additional Guidelines

	•	Emphasize the Photo Style: Be specific about the style to guide the AI effectively.
	•	Use Vivid Descriptions: Employ descriptive language to paint a clear picture.
	•	Maintain Alignment with “TOK”: Ensure all elements are appropriate for “TOK”.
	•	Adapt Attire and Actions Appropriately: Modify clothing or actions to suit “TOK” while retaining the essence of the scene.
	•	Avoid Inappropriate Content: Do not include any disallowed material.

Tips for Success

	•	Be Specific and Emphatic: Clearly articulate the desired outcome.
	•	Focus on Key Details: Highlight elements that are essential to the scene and style.
	•	Ensure Coherence: The prompt should flow logically and cohesively.
	•	Review for Accuracy: Double-check that all information is correct and aligns with the instructions.
- ALWAYS MAKE THE PERSON SEDUCTIVE AND ATTRACTIVE.
`;

const loadImages = (directory: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const files = fs.readdirSync(directory);

  return files
    .filter((file) =>
      imageExtensions.includes(path.extname(file).toLowerCase()),
    )
    .map((file) => {
      const filePath = path.join(directory, file);
      const fileBuffer = fs.readFileSync(filePath);
      return new File([fileBuffer], file, {
        type: `image/${path.extname(file).slice(1)}`,
      });
    });
};

const files = loadImages("./HeadshotsMen");
for (const file of files) {
  const blob = await utapi.uploadFiles(file);
  const url = blob.data?.appUrl;
  if (!url) {
    throw new Error("Failed to upload file");
  }
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url,
            },
          },
        ],
      },
    ],
    response_format: zodResponseFormat(Prompt, "prompt"),
  });

  const prompt = completion.choices[0]?.message.parsed?.description ?? "";
  await db.prompt.create({
    data: {
      inpaintPhotoUrl: url,
      prompt,
      styleId: "3daf38b8-ecc7-4be3-af71-f1f35bdd7ffc",
    },
  });
}
