import { Switch } from "or-else";

import { CharType } from "@core/parser/char-type";

/**
 * Get the type of the character.
 */
export const getSymbolType = (char: string) =>
  Switch.of(char)
    .case("*", CharType.STAR)
    .case("~", CharType.TILDE)
    .case("_", CharType.UNDERSCORE)
    .case("-", CharType.HYPHEN)
    .case("<", CharType.CHEVRON_LEFT)
    .case(">", CharType.CHEVRON_RIGHT)
    .case("@", CharType.AT)
    .case(".", CharType.DOT)
    .case(",", CharType.COMMA)
    .case("`", CharType.BACKTICK)
    .case("#", CharType.HASH)
    .case(" ", CharType.WHITESPACE)
    .case("/", CharType.SLASH)
    .case("\\", CharType.BACKSLASH)
    .case("|", CharType.PIPE)
    .case("(", CharType.BRACE_OPEN)
    .case(")", CharType.BRACE_CLOSE)
    .case("{", CharType.CURLY_BRACE_OPEN)
    .case("}", CharType.CURLY_BRACE_CLOSE)
    .case("[", CharType.BRACKET_OPEN)
    .case("]", CharType.BRACKET_CLOSE)
    .case("!", CharType.EXCLAMATION_MARK)
    .case("?", CharType.QUESTION_MARK)
    .case(":", CharType.COLON)
    .case(";", CharType.SEMICOLON)
    .case("'", CharType.SINGLE_QUOTE)
    .case('"', CharType.DOUBLE_QUOTE)
    .case("+", CharType.PLUS)
    .case("$", CharType.DOLLAR_SIGN)
    .case("%", CharType.PERCENT)
    .case("&", CharType.AMPERSAND)
    .case("^", CharType.CARET)
    .case("\n", CharType.EOL)
    .case("\t", CharType.TAB)
    .case((c) => !Number.isNaN(Number(c)), CharType.OCTET)
    .default(CharType.CHAR);
