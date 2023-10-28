const functions = require('firebase-functions');
const OpenAIApi = require('openai');
const openai = new OpenAIApi({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

exports.generateImage = functions.https.onCall(async (data, context) => {
    try {
        const response = await openai.images.generate({
            prompt: data.prompt,
            n: 1,
            response_format: 'url',
            size: '1024x1024',
        });

        return {
            imageUrl: response.data[0].url
        };
    } catch (error) {
        throw new functions.https.HttpsError('unknown', error.message);
    }
});

