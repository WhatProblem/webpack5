module.exports = function(content) {
    console.log('自定义loader')
    var useStrict = '"use strict";\n\n'
    return useStrict + content
}