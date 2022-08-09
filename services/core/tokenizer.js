
var KEYWORDS = [
    'break',
    'case', 'catch', 'const', 'continue',
    'debugger', 'default', 'delete', 'do',
    'else', 'enum',
    'false', 'finally', 'for', 'function',
    'if', 'in', 'instanceof',
    'new', 'null',
    'return',
    'switch',
    'this', 'throw', 'true', 'try', 'typeof',
    'var', 'void',
    'while', 'with', "let", "var"
];

var TOKENS_OPS = {
    "if": "BEGIN_COND",
    "for": "BEGIN_LOOP",
    "while": "BEGIN_LOOP",
    "function": "BEGIN_FUNC",
    "switch": "BEGIN_COND",
    "else": "BEGIN_ALT_COND",
    "else if": "BEGIN_ALT_COND",
    "case": "BEGIN_ALT_COND",
    "let": "VAR_DEF",
    "var": "VAR_DEF",
    "=>": "BEGIN_FUNC"
}

var OPERATORS = {
    '>>>=': 'ASSIGN_URSH',
    '>>=':  'ASSIGN_RSH',
    '<<=':  'ASSIGN_LSH',
    '|=':   'ASSIGN_BITWISE_OR',
    '^=':   'ASSIGN_BITWISE_XOR',
    '&=':   'ASSIGN_BITWISE_AND',
    '+=':   'ASSIGN_PLUS',
    '-=':   'ASSIGN_MINUS',
    '*=':   'ASSIGN_MUL',
    '/=':   'ASSIGN_DIV',
    '%=':   'ASSIGN_MOD',
    ';':    'SEMICOLON',
    ',':    'COMMA',
    '?':    'HOOK',
    ':':    'COLON',
    '||':   'OR',
    '&&':   'AND',
    '|':    'BITWISE_OR',
    '^':    'BITWISE_XOR',
    '&':    'BITWISE_AND',
    '===':  'EQ',
    '==':   'EQ',
    '=':    'ASSIGN',
    '!==':  'STRICT_NE',
    '!=':   'NE',
    '!==':   'NE',
    '<<':   'LSH',
    '<=':   'LE',
    '<':    'LT',
    '>>>':  'URSH',
    '>>':   'RSH',
    '>=':   'GE',
    '>':    'GT',
    '++':   'INCREMENT',
    '--':   'DECREMENT',
    '+':    'PLUS',
    '-':    'MINUS',
    '*':    'MUL',
    '/':    'DIV',
    '%':    'MOD',
    '!':    'NOT',
    '~':    'BITWISE_NOT',
    '.':    'DOT',
    '[':    'LEFT_BRACKET',
    ']':    'RIGHT_BRACKET',
    '{':    'LEFT_CURLY',
    '}':    'RIGHT_CURLY',
    '(':    'LEFT_PAREN',
    ')':    'RIGHT_PAREN'

};


// Regular Expressions --------------------------------------------------------
// ----------------------------------------------------------------------------
var opMatch = '^';
for (var i in OPERATORS) {

    if (opMatch !== '^') {
        opMatch += '|^';
    }

    opMatch += i.replace(/[?|^&(){}\[\]+\-*\/\.]/g, '\\$&');

}

var opRegExp = new RegExp(opMatch),
    fpRegExp = /^\d+\.\d*(?:[eE][-+]?\d+)?|^\d+(?:\.\d*)?[eE][-+]?\d+|^\.\d+(?:[eE][-+]?\d+)?/,
    reRegExp = /^\/((?:\\.|\[(?:\\.|[^\]])*\]|[^\/])+)\/([gimy]*)/,
    intRegExp = /^0[xX][\da-fA-F]+|^0[0-7]*|^\d+/,
    multiCommentRegExp = /^\/\*(.|[\r\n])*?\*\//m,
    commentRegExp = /^\/\/.*/,
    identRegExp = /^(?![0-9;*-])[$_\w]+/,
    wsRegExp = /^[\ \t]+/,
    strRegExp = /^'([^'\\]|\\.)*'|^"([^"\\]|\\.)*"/;

let _Token = function(type ='', value='', plain=''){
    this.type = type;
    this.value = value;
    this.plain = plain;
}

block_marker = [];


let Tokenizer = (stream) => {

    let cursor = 0;
    let tokens = [];

    let token;
    let tokenizers = [];

    while(cursor < stream.length){

        let curr = stream.substr(cursor);

        let m;
        
        //KEYWORDS
        token = new _Token();

        if ((m = curr.match(multiCommentRegExp ))) {

            // multi line comment - All comments will be removed

            token.type = 'MULTI_COMMENT';
            token.plain = m[0];
            token.value = m[0].slice(2, -2);

            cursor += m[0].length;
        }
        else if((m = curr.match(commentRegExp))) {
            // single line Comment
            token.type = 'COMMENT';
            token.plain = m[0];
            token.value = m[0].substr(2);

            cursor += m[0].length;
            
        }
        else if(m = curr.match(identRegExp) ){
           
            if(KEYWORDS.indexOf(m[0]) !== -1){

                token.type = "KEYWORD";
                let op = TOKENS_OPS[m[0]];
                token.value = op === undefined ? 'RESERVED_WORD' : op;
                token.plain = m[0];
            }
            else{
                token.type = "IDENTIFIER";
                token.value = "IDENT";
                token.plain = m[0];
            }

            cursor += m[0].length;
            
            tokens.push(token);
        }
    
        //OPERATORS
    
        else if((m = curr.match(opRegExp)) ){

            let v = OPERATORS[m[0]];
            if(v){
                token.type = "OPERATOR";
                token.value = v;
                token.plain = m[0];
            }            
            cursor += m[0].length;
            if(token.value !== 'SEMICOLON')
                tokens.push(token);

        }
        else if ((m = curr.match(fpRegExp))) {
            // Float
            token.type = 'CONSTANT';
            token.plain = parseFloat(m[0]);
            token.value = 'NUMBER';

            cursor += m[0].length;
            tokens.push(token);

        // Integer
        } else if ((m = curr.match(intRegExp))) {
            token.type = 'CONSTANT';
            token.plain = parseInt(m[0]);
            token.value = 'NUMBER';

            cursor += m[0].length;
            tokens.push(token);

        // String
        } else if ((m = curr.match(strRegExp))) {
            token.type = 'CONSTANT';
            token.plain = eval(m[0]);
            token.value = 'STRING';
            cursor += m[0].length;
            
            tokens.push(token);
            

        }
        else if((m = curr.match(wsRegExp))) {
            // ignoring whitespace
            cursor += m[0].length;

        } 
        else{
            cursor++;
        }

        
        // console.log(token)
    }

    let revised_tokens = [];

    for(let i=0;i<tokens.length; i++){
        
        revised_tokens.push(tokens[i]);

        if(tokens[i].value === 'BEGIN_COND'){

            let block = [];
            let j = 0;
            do{
                if(tokens[i+j+1].value === "LEFT_PAREN"){
                    block.push(tokens[i+j+1].value);
                }
                else if(tokens[i+j+1].value === "RIGHT_PAREN"){
                    block.pop();
                }
                j++;

                

            }while(block.length > 0);
            
            
            i += j;
        }

        
        
    }

    return revised_tokens;
}




module.exports = Tokenizer;