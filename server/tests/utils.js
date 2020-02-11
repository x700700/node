

exports.extractCookies = (res) => {
    const re = new RegExp('; path=/; httponly', 'gi');
    const headers = res.headers['set-cookie'];
    return headers && headers.map(r => r.replace(re, '')).join('; ');
};

exports.extractJwt = (res) => {
    return res.body.token;
};
