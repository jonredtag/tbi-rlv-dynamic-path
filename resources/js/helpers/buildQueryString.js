const buildQueryString = (ob) => {
    let query = '';

    const queryParts = [];
    Object.keys(ob).forEach((key) => {
        if (typeof ob[key] === 'object' && ob[key].length) {
            // this is an array
            for (let i = 0; i < ob[key].length; i += 1) {
                queryParts.push(`${key}[]=${ob[key][i]}`);
            }
        } else {
            queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(ob[key])}`);
        }
    });

    query = queryParts.join('&');
    return query;
};

export default buildQueryString;
