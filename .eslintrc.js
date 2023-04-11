module.exports = {
	extends: "erb",
	rules: {
		// A temporary hack related to IDE not resolving correct package.json
		"compat/compat": "off",
		"no-array-constructor": "off",
		"no-console": "off",
		"import/prefer-default-export": "off",
		"import/no-extraneous-dependencies": "off",
		"import/extensions": "off",
		"import/no-unresolved": "off",
		"import/no-import-module-exports": "off",
		"react/destructuring-assignment": "off",
		"react/function-component-definition": "off",
		"react/react-in-jsx-scope": "off",
		"react/jsx-filename-extension": "off",
		"react/jsx-props-no-spreading": "off",
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		project: "./tsconfig.json",
		tsconfigRootDir: __dirname,
		createDefaultProgram: true,
	},
	settings: {
		"import/resolver": {
			// See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
			node: {},
			webpack: {
				config: require.resolve(
					"./.erb/configs/webpack.config.eslint.ts"
				),
			},
			typescript: {},
		},
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
	},
};
