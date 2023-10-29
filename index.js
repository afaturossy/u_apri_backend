import express from "express"
import {addBalasan, addHadir, addPesan, buatTable, getAllHadir, getAllPesan} from "./database-method.js";

const app = express()
const port = 4002

app.get('/', async (req, res) => {
    res.send('Hello World!')
})

app.get("/get-hadir", async (req, res) => {
    const data = await getAllHadir()
    res.json(data)
})

app.get("/add-hadir", async (req, res) => {
    let {nama, hadir, jumlah} = req.query
    hadir = hadir === "true";

    if (nama && jumlah) {
        await addHadir(nama, hadir, jumlah)
    } else {
        console.log("data tidak di tambah")
    }
    res.send("")
})

app.get("/get-pesan", async (req, res) => {
    const data = await getAllPesan()
    res.json(data)
})

app.get("/add-pesan", async (req, res) => {
    const {nama, pesan} = req.query
    if (nama && pesan) {
        await addPesan(nama, pesan, [])
    } else {
        console.log("syarat Tidak Lengkap")
    }
    res.send("")
})

app.get("/add-balasan", async (req, res) => {
    const {id, nama, balasan} = req.query
    if (id && balasan && nama) {
        await addBalasan(id, nama, balasan)
    }
    res.send("")
})

app.listen(port, async () => {
    await buatTable()
    console.log("SERVER UNDANGAN RUNNING IN PORT " + port)
})