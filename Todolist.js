import { Client } from 'pg';
import { Command } from 'commander';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.PORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const program = new Command();
program
    .name('CRUD todolist app')
    .description('operate CRUD with database via CLI')
    .option('-l ,--list', 'list all items')
    .option('-a ,--add <Description>', 'add new item') //edge case ""
    .option('-d ,--delete <id>', 'delete selected item id')
    .option('-c ,--check <id>', 'check done selected id')

program.parse(process.argv);

const option = program.opts();

async function getDescription(id) {
    try {
        const row = await client.query(`SELECT * FROM todolist WHERE id = ${id}`);
        return row.rows[0].description;
    } catch (err) {
        console.log(err);
    }
}


async function list() {
    try {
        const list = await client.query("SELECT * FROM todolist");
        console.log(list.rows);
    } catch (err) {
        console.log("query error: " + err);
    }
}

async function add(description) {
    try {
        if (description.trim() == "") {
            throw new Error("Empty string input");
        }
        await client.query(`INSERT INTO todolist (description) VALUES ('${description}');`);
        await list();
        console.log(`Added ${description}`);

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

async function del(id) {
    try {
        ////check if task exists
        const existRes = await client.query(`SELECT * FROM todolist WHERE id = ${id};`);
        if (existRes.rowCount === 0) {
            throw new Error("input id is not exists");
        }

        const description = await getDescription(id);
        //delete row
        await client.query(`DELETE FROM todolist WHERE id = ${id};`);

        await list();
        console.log(`Deleted "${description}"`);

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

async function done(id) {
    try {
        //check if task exists
        const existRes = await client.query(`SELECT * FROM todolist WHERE id = ${id};`);
        if (existRes.rowCount === 0) {
            throw new Error("input id is not exists");
        }

        //check if a task is already "done"
        const res = await client.query(`SELECT status FROM todolist WHERE id = ${id};`);
        const status = res.rows[0].status;
        if (status === "DONE") {
            throw new Error(`Task id: ${id} is already DONE!`);
        }

        const description = await getDescription(id);
        //update a task
        await client.query(`UPDATE todolist SET status = 'DONE' WHERE id = ${id};`);

        await list();
        console.log(`Checked "${description}" Done!`);

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}


//list add delete check
async function main() {

    try {
        //connect to database
        await client.connect();
    } catch (err) {
        console.log(err);
        process.exit(1);
    } finally {

        if (option.list) {
            await list();
        }
        else if (option.add) {
            await add(String(option.add));
        }
        else if (option.delete) {
            await del(option.delete);
        }
        else if (option.check) {
            await done(option.check);
        }
    }

    process.exit(0);
}

main();