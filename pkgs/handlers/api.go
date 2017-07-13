package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"
	"vidlib/pkgs/models"

	"github.com/labstack/echo"
)

var myClient = &http.Client{Timeout: 10 * time.Second}

func getJson(url string, target interface{}) error {
	r, err := myClient.Get(url)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	return json.NewDecoder(r.Body).Decode(target)
}

type H map[string]interface{}

type barcodeResult interface{}

// type barcodeResult struct {
// 	code  string `json:"code"`
// 	items []struct {
// 		brand                  string
// 		color                  string
// 		currency               string
// 		Description            string
// 		dimension              string
// 		ean                    string
// 		elid                   string
// 		highest_recorded_price int
// 		images                 []string
// 		lowest_recorded_price  int
// 		model                  string
// 		offers                 interface{}
// 		size                   string
// 		title                  string
// 		upc                    string
// 		weight                 string
// 	} `json:"items"`
// 	offset int `json:"offset"`
// 	total  int `json:"total"`
// }

func GetBarcodes(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {

		return c.JSON(http.StatusOK, models.PullBarcodes(db))
	}
}

func PutBarcodeData(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {

		var barcode models.Barcode

		c.Bind(&barcode)

		id, err := models.InsertBarcode(db, barcode.Title, barcode.Number, barcode.Description, barcode.Image)
		// Return a JSON response if successful
		if err == nil {
			return c.JSON(http.StatusCreated, H{
				"created": id,
			})
			// Handle any errors
		} else {
			return err
		}
	}

}

func RemoveBarcode(db *sql.DB) echo.HandlerFunc {
	return func(c echo.Context) error {
		id, _ := strconv.Atoi(c.Param("id"))

		_, err := models.DeleteBarcode(db, id)
		// Return a JSON response on success
		if err == nil {
			return c.JSON(http.StatusOK, H{
				"deleted": id,
			})
			// Handle errors
		} else {
			return err
		}
	}
}

func GetBarcodeData() echo.HandlerFunc {
	return func(c echo.Context) error {
		searchResult := new(barcodeResult)
		bcode := c.FormValue("number")
		url := "https://api.upcitemdb.com/prod/trial/lookup?upc=" + bcode
		// fmt.Println(url)
		getJson(url, searchResult)

		return c.JSON(http.StatusOK, searchResult)
	}
}
