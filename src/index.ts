#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';



function generateDefinition (
	name: string,
	obj: any,
	indentStr: string,
	outputType: 'interface' | 'type'
): string {
	const pad = (level: number) => indentStr.repeat(level);

	function parseType (value: any, level: number): string {
		if (Array.isArray(value)) {
			if (value.length === 0) return 'any[]';
			const first = value[0];
			return `${parseType(first, level)}[]`;
		}
		if (value === null) return 'any';

		switch (typeof value) {
			case 'string':
				return 'string';
			case 'number':
				return 'number';
			case 'boolean':
				return 'boolean';
			case 'object':
				return generateInlineObject(value, level);
			default:
				return 'any';
		}
	}

	function generateInlineObject (obj: any, level: number): string {
		const entries = Object.entries(obj).map(([key, value]) => {
			return `${pad(level + 1)}${key}: ${parseType(value, level + 1)};`;
		});
		return `{\n${entries.join('\n')}\n${pad(level)}}`;
	}

	const body = generateInlineObject(obj, 0);
	return outputType === 'type'
		? `type ${name} = ${body}`
		: `interface ${name} ${body}`;
}

function generateDefinitionForJson ({ jsonPath, indentStr, outputKind }: {
	jsonPath: string,
	indentStr: string,
	outputKind: 'interface' | 'type'
}) {
	const fullPath = path.resolve(jsonPath);
	if (!fs.existsSync(fullPath)) {
		console.error(`File not found: ${fullPath}`);
		process.exit(1);
	}

	const rawData = fs.readFileSync(fullPath, 'utf8');
	const json = JSON.parse(rawData);
	const baseName = path.basename(jsonPath, path.extname(jsonPath)).replace(/[^a-zA-Z0-9]/g, '');
	const typeName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

	// If root is an array, generate type for its elements and wrap in []
	const rootValue = Array.isArray(json) && json.length > 0 ? json[0] : json;
	const definition = generateDefinition(typeName, rootValue, indentStr, outputKind);

	if (Array.isArray(json)) {
		console.log(outputKind === 'type'
			? `type ${typeName} = ${typeName}Item[];\n` + definition.replace(`type ${typeName}`, `type ${typeName}Item`)
			: `interface ${typeName}Item ${definition.slice(definition.indexOf('{'))}\n\ntype ${typeName} = ${typeName}Item[];`
		);
	} else {
		console.log(definition);
	}
}

function main () {
	const args = process.argv.slice(2);
	const jsonPaths = args.filter(arg => !arg.startsWith('--'));
	const useTabs = args.includes('--tabs');
	const useFourSpaces = args.includes('--spaces');
	const useType = args.includes('--type');
	const useInterface = args.includes('--interface');

	const indentStr = useTabs ? '\t' : useFourSpaces ? '    ' : '  ';
	const outputKind: 'interface' | 'type' = useType ? 'type' : 'interface';

	if (jsonPaths.length === 0) {
		console.error('Usage:\n\ttsj <json_paths> [--tabs | --spaces] [--type | --interface]');
		process.exit(1);
	}

	for (const jsonPath of jsonPaths) {
		generateDefinitionForJson({ jsonPath, indentStr, outputKind })
	}
}

main();
