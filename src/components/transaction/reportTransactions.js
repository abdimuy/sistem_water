const moment = require('moment');

const createReporteTransactions = (listTransactions, dateRange) => {
  try {
    const createListPayments = (listTransactions) => {
      let total = 0;
      const listPaymentsHTML = listTransactions.map((transaction) => {
        const {
          amount,
          dateCreate,
          clientName,
          numberWaterConnection,
          userName
        } = transaction;
        total += amount;
        return (
          `<tr class="item font">
            <td>${numberWaterConnection}</td>
            <td>${clientName}</td>
            <td>${moment(dateCreate).format('DD-MM-YYYY').toUpperCase()}</td>
            <td>$${amount}.00</td>
            <td>${userName}</td>
          </tr>`
        );
      });
      const totalHTML = 
      `<tr class="total font">
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
        <title>Reporte</title>
        ${styles}
      </head>
  
      <body>
        <div class="invoice-box">
          <div style="font-size: 15px; margin-bottom: 20px">
            REPORTE DEL ${moment(dateRange[0]).format('DD-MM-YYYY').toUpperCase()} AL ${moment(dateRange[1]).format('DD-MM-YYYY').toUpperCase()}
          </div>
          <table cellpadding="0" cellspacing="0">
            
            <tr class="heading font">
              <td>No. de Toma</td>
              <td>Cliente</td>
              <td>Fecha de cobro</td>
              <td>Cantidad</td>
              <td>Atendio</td>
            </tr>
  
            ${createListPayments(listTransactions).map(item => item).join('')}
  
            
          </table>
        </div>
        <br/>
        </body>
        </html>
  `;
  } catch (error) {
    console.log(error);
  }
}

const styles = `
  <style>
    .font
    {
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      font-size: 12px;
    }

    .single-line {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: pre;
    }
    
    .footer {
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      font-size: 12px;
      padding-left: 20px;
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
      line-height: 10px;
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
      font-size: 8px;
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

module.exports = createReporteTransactions