const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

program
    .name('node src/index.ts')
    .version('1.0.0')
    .description('Testing Commander Node Js Library');


program
    .command('deleterecord')
    .description(chalk.red('delete a record from the table'))
    .usage('-t <tablename> -i <id>')
    .option('-t, --tablename <tablename>', 'Required: Choose from UsersTable, RecordsTable and LogsTable')
    .option('-i, --id <id>', 'Defaults to 0 if not provided')
    .option('-d, --dryrun', 'Dry Run. Do not actually delete')
    .option('-f, --force', 'Unsafe. Force delete')
    .action( async function(options) {

        if(!options.tablename) {
            return this.outputHelp();
        }

        if(!options.id) {
            options.id = 0;
        }

        if(hasAccess(options.tablename)) {

            if(dependentRecords(options.id, options.tablename) > 0) {
                console.log(chalk.red("Id: " + options.id + " has " + dependentRecords(options.id, options.tablename) + " records in Records Table"));
            } else if (getRecordCount(options.id)){
                console.log(chalk.red('This will delete '+getRecordCount(options.id)+' records'));
            }
            
            inquirer
                .prompt([{ type: 'confirm', name: 'sureDel', message: 'Are you sure, you want to delete?', default: false },])
                .then(function(answers) {
                    if(answers.sureDel) {
                        inquirer
                            .prompt([{ type: 'confirm', name: 'verySureDel', message: 'Are you very sure, you want to delete?', default: false },])
                            .then(function(answers) {
                                if(answers.verySureDel) {
                                    console.log(chalk.blue('You are getting on my nerves!! Deleting Records...'))
                                    setTimeout(function() {console.log(chalk.blue("Records Deleted. Are you happy now!!"));}, 1000)
                                } else {
                                    console.log('Thank God. Deletion Cancelled');
                                }
                            });
                    } else {
                        console.log('Smart One. Deletion Cancelled');
                    }
                });

        } else {
            console.log(chalk.red('Hah Nice Try. You do not have access to this table'));
        }
    });

function hasAccess(tablename) {
    if (tablename === "UsersTable" || tablename === "RecordsTable") {
        return true;
    } else {
        return false;
    }
}

function getRecordCount(id) {
    if(id != 0) {
        return 10;
    }
    return 0;
}

function dependentRecords(id, tablename) {
    if(id == 0 && tablename === "UsersTable") {
        return 25;
    }
    return 0;
}

program.parse(process.argv);