import {CfnDatabase, CfnTable} from 'aws-cdk-lib/aws-timestream';

export function StorageStack( {stack, app}) {

	const db = new CfnDatabase(stack, "TimeStreamDb", {
		databaseName: "metricsdb"+app.stage,
	});

	const table = new CfnTable(stack, "metricsTable", {
		databaseName: db.databaseName,
		tableName: "metrics",
		
	});

	table.node.addDependency(db);

	stack.addOutputs({
		metricsDb: db.databaseName
	})

	return { db, }

}