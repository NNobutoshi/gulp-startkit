import path              from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'eslint/config';
import { FlatCompat }   from '@eslint/eslintrc';
import js               from '@eslint/js';

import globals from 'globals';

const
  __filename = fileURLToPath( import.meta.url )
  ,__dirname = path.dirname( __filename )
  ,compat    = new FlatCompat( {
    baseDirectory     : __dirname,
    recommendedConfig : js.configs.recommended,
    allConfig         : js.configs.all
  } )
;
export default defineConfig(
  [ {
    extends : compat.extends( 'jquery' ),

    languageOptions : {
      globals : {
        ...globals.browser,
        ...globals.node,
        $ : true,
      },

      ecmaVersion : 2022,
      sourceType : 'module',
    },

    rules : {
      indent            : [ 'error', 2 ],
      'linebreak-style' : [ 'error', 'unix' ],
      quotes            : [ 'error', 'single' ],
      semi              : [ 'error', 'always' ],
      'comma-spacing'   : [ 'off' ],
      'comma-style'     : [ 'off' ],
      'key-spacing' : [
        'error',
        {
          'mode' : 'minimum',
          'beforeColon' : true,
          'afterColon'  : true
        }
      ],
      'comma-dangle'    : [ 'off' ],
      'no-unused-vars'  : [ 'error', {
        args              : 'all',
        argsIgnorePattern : '^_|^e|^index',
      } ],

      camelcase : [ 'off' ],

      'lines-around-comment' : [ 'error', {
        beforeLineComment : false,
      } ],

      'operator-linebreak' : [ 'error', 'after', {
        overrides : {
          '?'  : 'ignore',
          ':'  : 'ignore',
          '||' : 'ignore',
          '&&' : 'ignore',
          '+'  : 'ignore',
          '-'  : 'ignore',
        },
      } ],
    },
  } ]
);
