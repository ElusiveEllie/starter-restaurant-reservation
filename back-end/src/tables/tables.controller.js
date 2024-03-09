const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}

async function tableExists (req, res, next) {
  const table_id = req.params.tableId
  const table = await tablesService.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: "Table cannot be found." })
}

async function update(req, res, next) {
  const updatedTable = {
    ...res.locals.table,
    ...req.body.data,
    table_id: res.locals.table.table_id,
  }
  await tablesService.update(updatedTable);
  next();
}

async function readUpdate(req, res, next) {
  let data = await tablesService.readAfterUpdate(res.locals.table.table_id);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(create)],
  update: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(update),
    asyncErrorBoundary(readUpdate),
  ],
};
