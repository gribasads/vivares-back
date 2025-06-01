const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    ...(process.env.IS_OFFLINE && {
        endpoint: 'http://localhost:8000',
        credentials: {
            accessKeyId: 'local',
            secretAccessKey: 'local'
        }
    })
});

const docClient = DynamoDBDocumentClient.from(client);

module.exports = docClient; 