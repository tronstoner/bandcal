import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import configuration, { ConfigOptions } from "./configuration";
import { createDataSource } from "./data-source";
import { CalendarEntry } from "./models/CalendarEntry";
import { Message } from "./models/Message";
import { ContactInfo } from "./models/ContactInfo";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const AppDataSource = createDataSource(configuration as ConfigOptions);

AppDataSource.initialize()
  .then(() => {
    console.log(`Database connected at ${configuration.database.file}`);
  })
  .catch((error) => console.error(error));

app.get("/", async (req: Request, res: Response) => {
  res.send("Nope");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

// Calendar Entry CRUD
app.get("/calendar", async (req: Request, res: Response, next: Function) => {
  try {
    const repo = AppDataSource.getRepository(CalendarEntry);
    const { startdate, enddate } = req.query;
    const query = repo
      .createQueryBuilder("calendarEntry")
      .orderBy("calendarEntry.date", "ASC");
    console.log(startdate, enddate);

    if (startdate) {
      query.andWhere("DATE(calendarEntry.date) >= :startdate", {
        startdate,
      });
    }

    if (enddate) {
      query.andWhere("DATE(calendarEntry.date) <= :enddate", {
        enddate,
      });
    }

    const entries = await query.getMany();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

app.get(
  "/calendar/:date",
  async (req: Request, res: Response, next: Function) => {
    try {
      const repo = AppDataSource.getRepository(CalendarEntry);
      const entry = await repo.findOneBy({ date: req.params.date });
      if (entry) {
        res.json(entry);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

app.post("/calendar", async (req: Request, res: Response, next: Function) => {
  try {
    const repo = AppDataSource.getRepository(CalendarEntry);
    const existingEntry = await repo.findOneBy({ date: req.body.date });
    if (existingEntry) {
      await repo.update({ date: req.body.date }, req.body);
      res.json({ message: "Entry updated" });
    } else {
      const entry = repo.create(req.body);
      const result = await repo.save(entry);
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

app.delete(
  "/calendar/:date",
  async (req: Request, res: Response, next: Function) => {
    try {
      const repo = AppDataSource.getRepository(CalendarEntry);
      await repo.delete({ date: req.params.date });
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

// Message CRUD
app.get("/messages", async (req: Request, res: Response, next: Function) => {
  try {
    const repo = AppDataSource.getRepository(Message);
    const { cursor, limit = 10 } = req.query;
    const query = repo
      .createQueryBuilder("message")
      .orderBy("message.id", "DESC")
      .take(Number(limit));

    if (cursor) {
      query.where("message.id < :cursor", { cursor: Number(cursor) });
    }

    const messages = await query.getMany();
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

app.get(
  "/messages/:id",
  async (req: Request, res: Response, next: Function) => {
    try {
      const repo = AppDataSource.getRepository(Message);
      const message = await repo.findOneBy({ id: Number(req.params.id) });
      if (message) {
        res.json(message);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

app.post("/messages", async (req: Request, res: Response, next: Function) => {
  try {
    const repo = AppDataSource.getRepository(Message);
    const { id, name, text } = req.body;

    if (id) {
      const existingMessage = await repo.findOneBy({ id });
      if (existingMessage) {
        await repo.update(id, {
          ...req.body,
          updated: new Date(),
        });
        res.json({ message: "Message updated" });
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } else {
      const message = repo.create({
        name,
        text,
        datetime: new Date(),
        updated: new Date(),
      });
      const result = await repo.save(message);
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

app.delete(
  "/messages/:id",
  async (req: Request, res: Response, next: Function) => {
    try {
      const repo = AppDataSource.getRepository(Message);
      await repo.delete(req.params.id);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

// ContactInfo CRUD
app.get("/contacts", async (req: Request, res: Response, next: Function) => {
  try {
    const repo = AppDataSource.getRepository(ContactInfo);
    const contacts = await repo.find();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

app.get(
  "/contacts/:id",
  async (req: Request, res: Response, next: Function) => {
    try {
      const repo = AppDataSource.getRepository(ContactInfo);
      const contact = await repo.findOneBy({ id: Number(req.params.id) });
      if (contact) {
        res.json(contact);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

app.post("/contacts", async (req: Request, res: Response, next: Function) => {
  try {
    const repo = AppDataSource.getRepository(ContactInfo);
    const { id, ...contactData } = req.body;

    if (id) {
      const existingContact = await repo.findOneBy({ id });
      if (existingContact) {
        await repo.update(id, contactData);
        res.json({ message: "Contact updated" });
      } else {
        const contact = repo.create(req.body);
        const result = await repo.save(contact);
        res.json(result);
      }
    } else {
      const contact = repo.create(contactData);
      const result = await repo.save(contact);
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

app.delete(
  "/contacts/:id",
  async (req: Request, res: Response, next: Function) => {
    try {
      const repo = AppDataSource.getRepository(ContactInfo);
      await repo.delete(req.params.id);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
);

app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(configuration.port, () => {
  console.log(`Server started on http://localhost:${configuration.port}`);
});
