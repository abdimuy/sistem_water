const moment = require('moment');

const createResivo = (data) => {
  try {

    const {
      name,
      lastName,
      street,
      houseNumber,
      colonia,
      numberWaterConnection,
      typeClient,
      report: { transactions },
      report,
      urlSignings
    } = data;
  
    const createListPayments = (listPayments) => {
      let total = 0;
      const listPaymentsHTML = listPayments.map((payment) => {
        const { amount, dateTransaction, name: details, note } = payment;
        total += amount;
        return (
          `<tr class="item">
            <td>${details} - ${moment(dateTransaction).format('MMMM YYYY').toUpperCase()} ${note !== undefined ? ` - ${note}` : ''}</td>
            <td>$${amount}.00</td>
          </tr>
          
          `
        );
      });
      const totalHTML = 
      `<tr class="total">
        <td></td>
        <td>Total: $${total}.00</td>
      </tr>`
      return [...listPaymentsHTML, totalHTML]
    };
  
    return`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>A simple, clean, and responsive HTML invoice template</title>
        ${styles}
      </head>
  
      <body>
        <div class="invoice-box">
          <table cellpadding="0" cellspacing="0">
            <tr class="top">
              <td colspan="2">
                <table>
                  <tr>
                    <td class="title">
                      <div style=" height: 150px">
                        <img src="http://localhost:3000/logo.jpeg" style="width: auto; height: 100%" />
                      </div>
                    </td>
                    <td>
                      Fecha: ${moment(report.date).format('LL').toUpperCase()}<br/>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <tr class="information">
              <td colspan="2">
                <table>
                  <tr>
                    <td>
                      ${name} ${lastName}<br />
                      ${numberWaterConnection}<br />
                      ${street} ${houseNumber} ${colonia}<br />
                    </td>
  
                    <td>
                      
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
  
            <tr class="heading">
              <td>Detalles</td>
  
              <td>Precio</td>
            </tr>
  
            ${createListPayments(transactions)}
  
            
          </table>
        </div>
        <table class="signings-container">
          <tr>
            <td class="signing">
              <div>
                <img src="${urlSignings[0]?.url}" style="width: 150px; height: 100px; margin-left: 25%"/>
              </div>
              <div style="padding-left: 25%">
                __________________________
              </div>
              <div  class="font" style="padding-left: 25%">
                ${urlSignings[0]?.name}
              </div>
            </td>
            <td class="signing">
              <div>
                <img src="${urlSignings[1]?.url}" style="width: 150px; height: 100px; margin-left: 25%"/>
              </div>
              <div style="padding-left: 25%">
                __________________________
              </div>
              <div  class="font" style="padding-left: 25%">
                ${urlSignings[1]?.name}
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
  } catch (error) {
    console.log(error);
  }
}

const styles = `
  <style>
    .font {
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      font-size: 12px;
    }

    .signings-container {
      width: 100%;
    }

    .border {
      border: 1px solid red
    }

    .signing {
      justify-content: center;
      width: 50%
    }
    
    .invoice-box {
      max-width: 800px;
      margin: auto;
      padding: 30px;
      border: 1px solid #eee;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
      font-size: 14px;
      line-height: 12px;
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      color: #555;
    }

    .invoice-box table {
      width: 100%;
      line-height: inherit;
      text-align: left;
    }

    .invoice-box table td {
      padding: 5px;
      vertical-align: top;
    }

    .invoice-box table tr td:nth-child(2) {
      text-align: right;
    }

    .invoice-box table tr.top table td {
      padding-bottom: 20px;
    }

    .invoice-box table tr.top table td.title {
      font-size: 45px;
      line-height: 45px;
      color: #333;
    }

    .invoice-box table tr.information table td {
      padding-bottom: 40px;
    }

    .invoice-box table tr.heading td {
      background: #eee;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
    }

    .invoice-box table tr.details td {
      padding-bottom: 20px;
    }

    .item {
      height: 8px
    }

    .invoice-box table tr.item td {
      border-bottom: 1px solid #eee;
    }

    .invoice-box table tr.item.last td {
      border-bottom: none;
    }

    .invoice-box table tr.total td:nth-child(2) {
      border-top: 2px solid #eee;
      font-weight: bold;
    }

    @media only screen and (max-width: 600px) {
      .invoice-box table tr.top table td {
        width: 100%;
        display: block;
        text-align: center;
      }

      .invoice-box table tr.information table td {
        width: 100%;
        display: block;
        text-align: center;
      }
    }

    /** RTL **/
    .invoice-box.rtl {
      direction: rtl;
      font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    }

    .invoice-box.rtl table {
      text-align: right;
    }

    .invoice-box.rtl table tr td:nth-child(2) {
      text-align: left;
    }
  </style>`

module.exports = createResivo