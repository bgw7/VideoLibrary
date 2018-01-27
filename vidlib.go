package main

import (
	"database/sql"
	"log"
	"os"
	"vidlib/pkgs/handlers"

	"github.com/labstack/echo"
	_ "github.com/lib/pq"
)

var (
	port       int
	dbhost     string
	dbuser     string
	dbport     int
	dbpassword string
	dbname     string
	db         *sql.DB
)

func initDB(filepath string) *sql.DB {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	// db, err := sql.Open("postgres", filepath)

	// Here we check for any db errors then exit
	if err != nil {
		panic(err)
	}

	// If we don't get any errors but somehow still don't get a db connection
	// we exit as well
	if db == nil {
		panic("db not connected")
	}
	return db
}

func migrate(db *sql.DB) {
	sql := `
    CREATE TABLE IF NOT EXISTS barcodes(
        Id serial NOT NULL,
        Title character varying(100),
		Number character varying(100) NOT NULL,
		Description character varying,
		Image character varying NOT NULL,
		CONSTRAINT id_pkey PRIMARY KEY (id)
    )
	WITH (OIDS=FALSE);
    `

	_, err := db.Exec(sql)
	// Exit if something goes wrong with our SQL statement above
	if err != nil {
		panic(err)
	}
}

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}
	// db := initDB(fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable",
	db := initDB("string")
	// db := initDB(fmt.Sprintf("dbname=%s host=%s user=%s port=%d password=%s sslmode=disable", dbname, dbhost, dbuser, dbport, dbpassword))
	// db := initDB(fmt.Sprintf("dbname=%s sslmode=disable", dbname))
	migrate(db)
	defer db.Close()
	e := echo.New()

	e.File("/", "public/index.html")

	e.File("/styles/style.css", "public/styles/style.css")
	e.File("/styles/items.css", "public/styles/items.css")

	e.File("/scripts/bundle.min.js", "public/scripts/bundle.min.js")
	e.File("/scripts/quagga.min.js", "public/scripts/quagga.min.js")
	e.File("/scripts/scanner.js", "public/scripts/scanner.js")
	e.File("/scripts/angular.min.js", "public/scripts/angular.min.js")
	e.File("/scripts/angular-ui-router.min.js", "public/scripts/angular-ui-router.min.js")
	e.File("/scripts/angular-masonry-directive.js", "public/scripts/angular-masonry-directive.js")

	e.File("/app.js", "public/app.js")
	e.File("/controllers.js", "public/controllers.js")
	e.File("/services.js", "public/services.js")
	e.File("/favicon.ico", "public/favicon.ico")
	e.File("/templates/items.html", "public/templates/items.html")

	// API END POINTS
	e.PUT("/scan", handlers.GetBarcodeData())
	e.PUT("/scan/add", handlers.PutBarcodeData(db))

	e.GET("/barcode", handlers.GetBarcodes(db))
	e.DELETE("/barcode/:id", handlers.RemoveBarcode(db))

	// START FILE SERVER
	e.Logger.Fatal(e.Start(":" + port))
}
