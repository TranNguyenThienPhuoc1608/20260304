module.exports = {
    genID: function (data) {
        // Handle numeric IDs
        if (data.length > 0 && !isNaN(data[0].id)) {
            let ids = data.map(
                function (e) {
                    return Number.parseInt(e.id);
                }
            )
            return Math.max(...ids) + 1
        }
        
        // Handle prefix-based IDs (r1, r2, r3, etc.)
        if (data.length > 0 && typeof data[0].id === 'string') {
            let prefix = data[0].id.replace(/[0-9]/g, '');
            let ids = data.map(
                function (e) {
                    return Number.parseInt(e.id.replace(prefix, ''));
                }
            )
            let nextNum = Math.max(...ids) + 1;
            return prefix + nextNum;
        }
        
        return 1;
    },
    getItemById: function (id, data) {
        let result = data.filter(
            function (e) {
                return e.id == id
            }
        )
        console.log(result);
        if (result.length) {
            return result[0];
        }
        return false;
    }
}