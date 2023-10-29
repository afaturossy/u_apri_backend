import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

async function connectDB() {
    try {
        const db = await open({
            filename: 'database.db',
            driver: sqlite3.Database
        });
        console.log('Berhasil terhubung ke database SQLite');
        return db;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

async function buatTable() {
    const db = await connectDB();
    try {
        await db.run('CREATE TABLE IF NOT EXISTS hadir (id INTEGER PRIMARY KEY, nama TEXT, hadir BOOLEAN, jumlah INTEGER)');
        await db.run('CREATE TABLE IF NOT EXISTS pesan (id INTEGER PRIMARY KEY, nama TEXT, pesan TEXT, balasan TEXT)');
    } catch (err) {
        console.error(err.message);
        throw err;
    } finally {
        await db.close();
    }
}

async function addHadir(nama, hadir, jumlah) {
    const db = await connectDB();
    try {
        await db.run('INSERT INTO hadir (nama, hadir, jumlah) VALUES (?, ?, ?)', [nama, hadir, jumlah]);
        console.log(`Data hadir dengan nama ${nama} telah disisipkan`);
    } catch (err) {
        console.error(err.message);
        throw err;
    } finally {
        await db.close();
    }
}

async function addPesan(nama, pesan, balasan) {
    const db = await connectDB();
    try {
        await db.run('INSERT INTO pesan (nama, pesan, balasan) VALUES (?, ?, ?)',
            [nama, pesan, JSON.stringify(balasan)]);
        console.log(`Data pesan dengan nama ${nama} telah disisipkan`);
    } catch (err) {
        console.error(err.message);
        throw err;
    } finally {
        await db.close();
    }
}

async function getAllHadir() {
    const db = await connectDB();
    try {
        const hasil = []
        const rows = await db.all('SELECT * FROM hadir');
        for (let i of rows) {

            let {id, nama, hadir, jumlah} = i
            hadir = hadir === 1
            hasil.push({id, nama, hadir, jumlah})
        }
        console.log(hasil)
        return hasil;
    } catch (err) {
        console.error(err.message);
        throw err;
    } finally {
        await db.close();
    }
}

async function getAllPesan() {
    const db = await connectDB();
    try {
        let result = []
        const rows = await db.all('SELECT * FROM pesan');
        for (let i of rows) {
            let {id, nama, pesan, balasan} = i
            balasan = JSON.parse(balasan)
            result.push({id, nama, pesan, balasan})
        }
        return result;
    } catch (err) {
        console.error(err.message);
        throw err;
    } finally {
        await db.close();
    }
}

async function addBalasan(id, nama, balasan) {
    const db = await connectDB();
    try {
        const data_awal = await db.get('SELECT * FROM pesan WHERE id = ?', [parseInt(id)]);
        const balasan_awal = JSON.parse(data_awal.balasan)
        balasan_awal.push({nama, pesan: balasan})
        await db.run('UPDATE pesan SET balasan = ? WHERE id = ?',
            [JSON.stringify(balasan_awal), id]);
    } catch (err) {
        console.error(err.message);
        throw err;
    } finally {
        await db.close();
    }

}

export {
    buatTable,
    getAllHadir,
    addHadir,
    addPesan,
    getAllPesan,
    addBalasan
};
