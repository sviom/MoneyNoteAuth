import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

const getConnectionString = async () => {
    // If you're using MSI, DefaultAzureCredential should "just work".
    // Otherwise, DefaultAzureCredential expects the following three environment variables:
    // - AZURE_TENANT_ID: The tenant ID in Azure Active Directory
    // - AZURE_CLIENT_ID: The application (client) ID registered in the AAD tenant
    // - AZURE_CLIENT_SECRET: The client secret for the registered application
    const credential = new DefaultAzureCredential();
    const keyvaultUrl = process.env.KEYVAULT_URI as string;
    const client = new SecretClient(keyvaultUrl, credential);

    // Create a secret
    // The secret can be a string of any kind. For example,
    // a multiline text block such as an RSA private key with newline characters,
    // or a stringified JSON object, like `JSON.stringify({ mySecret: 'MySecretValue'})`.
    // const uniqueString = new Date().getTime();
    // const secretName = `secret${uniqueString}`;
    // const result = await client.setSecret(secretName, 'MySecretValue');
    // console.log('result: ', result);

    // Read the secret we created
    const secret = await client.getSecret('mconnection');

    // Update the secret with different attributes
    // const updatedSecret = await client.updateSecretProperties(secretName, result.properties.version, {
    //     enabled: false,
    // });
    // console.log('updated secret: ', updatedSecret);

    // Delete the secret immediately without ability to restore or purge.
    // await client.beginDeleteSecret(secretName);
    return secret.value;
};

export { getConnectionString };
