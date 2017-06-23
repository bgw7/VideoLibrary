package models

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

type Barcode struct {
	Id          int    `json:"Id"`
	Number      string `json:"Number"`
	Title       string `json:"Title"`
	Description string `json:"Description"`
	Image       string `json:"Image"`
}

type BarcodeCollection struct {
	Barcodes []Barcode `json:"items"`
}

func PullBarcodes(db *sql.DB) BarcodeCollection {
	sql := "SELECT * FROM barcodes;"
	rows, err := db.Query(sql)
	// Exit if the SQL doesn't work for some reason
	if err != nil {
		panic(err)
	}
	// make sure to cleanup when the program exits
	defer rows.Close()

	result := BarcodeCollection{}
	for rows.Next() {
		// var ID int
		// var Name string
		barcode := Barcode{}
		err2 := rows.Scan(&barcode.Id, &barcode.Title, &barcode.Number, &barcode.Description, &barcode.Image)
		// Exit if we get an error
		if err2 != nil {
			panic(err2)
		}
		result.Barcodes = append(result.Barcodes, barcode)
	}
	return result
}

func InsertBarcode(db *sql.DB, title string, number string, description string, image string) (int, error) {

	var lastInsertId int

	err := db.QueryRow("INSERT INTO barcodes(title, number, description, image) VALUES($1, $2, $3, $4) returning id;", title, number, description, image).Scan(&lastInsertId)

	// Exit if we get an error
	if err != nil {
		panic(err)
	}

	// return result.LastInsertId()
	return lastInsertId, err
}

func DeleteBarcode(db *sql.DB, id int) (int64, error) {
	sql := "DELETE FROM barcodes WHERE id = $1;"

	// Create a prepared SQL statement
	stmt, err := db.Prepare(sql)
	// Exit if we get an error
	if err != nil {
		panic(err)
	}

	// Replace the '?' in our prepared statement with 'id'
	result, err2 := stmt.Exec(id)
	// Exit if we get an error
	if err2 != nil {
		panic(err2)
	}

	return result.RowsAffected()
}
