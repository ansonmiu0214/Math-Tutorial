grammar arithmetic;

file : expression EOF;

expression
   :  expression  (TIMES | DIV)  expression  #BinaryExpr
   |  expression  (PLUS | MINUS) expression  #BinaryExpr
   |  LPAREN expression RPAREN                  #UnaryExpr
   |  atom                                      #LiteralExpr
   ;

atom
   : (PLUS | MINUS)? UNSIGNED_INTEGER
   ;

UNSIGNED_INTEGER
   : NUMBER+
   ;

fragment NUMBER
   : [0-9]
   ;

LPAREN
   : '('
   ;


RPAREN
   : ')'
   ;


PLUS
   : '+'
   ;


MINUS
   : '-'
   ;


TIMES
   : '*'
   ;


DIV
   : '/'
   ;


GT
   : '>'
   ;


LT
   : '<'
   ;


EQ
   : '='
   ;


POINT
   : '.'
   ;


POW
   : '^'
   ;


WS
   : [ \r\n\t] + -> skip
   ;