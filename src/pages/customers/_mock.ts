import { Request, Response } from 'express';
import { parse } from 'url';
import { Customer, TableListParams, Contact, AppKey } from './data';

// mock tableListDataSource
let tableListDataSource: Customer[] = [];
let contactDataSource: Contact[] = [];
let appKeyDataSource: AppKey[] = [];
const channel = ['jinrong', 'jiaoyu', 'zhengfu', 'gongan'];
const names = ['软件开发', '品高', '电信', '广东省', '广州市', '公安局', '信息化', '招商'];
const titles = ['dba', 'ceo', 'cfo', 'coo'];
const cnames = ['李', '赵', '钱', '孙', '蛋', '丫', '梅', '高'];

// 初始化模拟数据
for (let i = 100000; i < 100028; i += 1) {
  tableListDataSource.push({
    id: i.toString(),
    name: names[Math.round(Math.random() * 10) % 8] + names[Math.round(Math.random() * 10) % 8],
    url: 'http://www.google.com',
    addr: names[Math.round(Math.random() * 10) % 8] + names[Math.round(Math.random() * 10) % 8],
    up: '天庭',
    channel: channel[i % 4],
    desc: '这是一段描述',
    createdAt: new Date(`2019-07-${Math.floor((i - 100000) / 2) + 1}`),
  });
}

for (let i = 200000; i < 200050; i += 1) {
  contactDataSource.push({
    id: i.toString(),
    cid: `${Math.round(Math.random() * 28) + 100000}`,
    name: cnames[Math.round(Math.random() * 10) % 8] + cnames[Math.round(Math.random() * 10) % 8],
    title: titles[i % 4],
    createdAt: new Date(`2019-07-${Math.floor((i - 200000) / 2) + 1}`),
  });
}

for (let i = 300000; i < 300050; i += 1) {
  appKeyDataSource.push({
    id: i.toString(),
    cid: `${Math.round(Math.random() * 28) + 100000}`,
    name: names[Math.round(Math.random() * 10) % 8] + names[Math.round(Math.random() * 10) % 8],
    secKey: i.toString(),
    to: new Date(`2022-07-${Math.floor((i - 300000) / 2) + 1}`),
    createdAt: new Date(`2019-07-${Math.floor((i - 300000) / 2) + 1}`),
  });
}

function getCustomer(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as TableListParams;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  return res.json(result);
}

function getCustomerById(req: Request, res: Response, u: string) {
  const { id } = req.params;
  let dataSource = tableListDataSource;
  return dataSource.filter((value: Customer, index: number) => {
    return value.id === id;
  })[0];
}

function getContact(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as TableListParams;

  let dataSource = contactDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  return res.json(result);
}

function getAppKey(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as TableListParams;

  let dataSource = appKeyDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  return res.json(result);
}

function postCustomer(req: Request, res: Response, u: string, b: Request) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, channel, desc, id } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => id.indexOf(item.id) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        id: i.toString(),
        name: `TradeCode ${i}`,
        channel,
        desc,
        createdAt: new Date(),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.id === id) {
          return { ...item, channel, desc, name };
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  return res.json(result);
}

export default {
  'GET /api/customer': getCustomer,
  'GET /api/contacts': getContact,
  'GET /api/appkeys': getAppKey,
  'GET /api/customer/:id': getCustomerById,
  'POST /api/customer': postCustomer,
};
