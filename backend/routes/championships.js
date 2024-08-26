const express = require("express");
const router = express.Router();
const pool = require("../db");
const io = require("../socket");

// Crea un nuovo campionato
router.post("/", async (req, res) => {
  console.log("Richiesta ricevuta:", req.body);
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO public.championships (name) VALUES ($1) RETURNING *",
      [name],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni tutti i campionati
router.get("/get", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM public.championships");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ottieni un campionato per ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM public.championships WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Championship not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// campionati a cui gli utenti sono iscritti
// ! DA FIXXARE
//
router.get("/getchamp", async (req, res) => {
  const email = req.query.members;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM public.championships WHERE members = $1",
      [email],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Errore durante il recupero dei campionati:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Aggiorna un campionato per ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      "UPDATE public.championships SET name = $1 WHERE id = $2 RETURNING *",
      [name, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Championship not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Elimina un campionato per ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM public.championships WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Championship not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UTENTE PARTECIPA AD UN CAMPIONATO
router.post("/:id/participate", async (req, res) => {
  const client = await pool.connect();
  try {
    const championshipId = req.params.id;
    const userEmail = req.body.email; // Leggi email dal corpo della richiesta

    console.log(
      `Richiesta partecipazione per il campionato ID: ${championshipId}, User Email: ${userEmail}`,
    );

    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    await client.query("BEGIN");

    // Verifica se il campionato esiste
    const checkQuery = "SELECT * FROM public.championships WHERE id = $1";
    const { rows: championshipRows } = await client.query(checkQuery, [
      championshipId,
    ]);

    if (championshipRows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Championship not found" });
    }

    const championship = championshipRows[0];
    let members = championship.members || []; // Gestisci il caso in cui members sia null

    console.log(`Members attuali: ${members}`);

    // Verifica se l'email è già presente tra i membri
    if (!members.includes(userEmail)) {
      const updateQuery =
        "UPDATE public.championships SET members = array_append(members, $1) WHERE id = $2 RETURNING *";
      const { rows: updatedRows } = await client.query(updateQuery, [
        userEmail,
        championshipId,
      ]);

      await client.query("COMMIT");

      // Emetti un evento Socket.IO
      io.emit("championshipUpdated", { championshipId, newMember: userEmail });
      console.log(
        `Partecipazione confermata per l'utente ${userEmail} nel campionato ${championshipId}`,
      );
      res.json({
        message: "Partecipazione confermata",
        championship: updatedRows[0],
      });
    } else {
      await client.query("ROLLBACK");
      console.log("Utente già partecipante");
      res.json({ message: "User already a participant" });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Errore nella partecipazione:", error);
    res
      .status(500)
      .json({ message: "Error participating in the championship" });
  } finally {
    client.release();
  }
});

const getCampionatoInfo = async (name, id) => {
  try {
    // Query per cercare campionato per ID e Nome
    const result = await pool.query(
      "SELECT * FROM public.championships WHERE id = $1 AND name = $2",
      [id, name],
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Errore nel recupero delle informazioni del campionato");
  }
};

// Route per ottenere le informazioni del campionato
router.get("/join/:name/:id", async (req, res) => {
  const { name, id } = req.params;

  // Validazione dell'ID del campionato (assicurati che sia un numero intero)
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "ID campionato non valido" });
  }

  // Sanitizzazione del nome del campionato per evitare SQL injection e altri attacchi
  const sanitized_name = name.replace(/[^a-zA-Z0-9-_]/g, "");

  try {
    const campionato = await getCampionatoInfo(sanitized_name, id);

    // Controlla se il campionato esiste e il nome corrisponde
    if (!campionato) {
      return res.status(404).json({ error: "Campionato non trovato" });
    }

    res.json(campionato);
  } catch (error) {
    console.error("Errore nel recupero delle informazioni:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

module.exports = router;

/*






*/
