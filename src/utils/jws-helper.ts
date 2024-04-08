import jose from 'node-jose';

export const createJWS = async function (rawKey: string, certChain: string[], payload: any) {
    const key = await jose.JWK.asKey(rawKey, 'pem');
    return await jose.JWS.createSign(
        {
            algorithm: 'RS256',
            format: 'compact',
            fields: {
                typ: 'JWT',
                x5c: certChain,
            },
        },
        key,
    )
        .update(JSON.stringify(payload))
        .final();
};
