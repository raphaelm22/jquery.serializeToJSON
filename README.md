# jquery.serializeToJSON


Adds the method `.serializeToJSON()` to [jQuery](http://jquery.com/) that Serialize an HTML form (familiar with ASP MVC) to a JavaScript object, supporting nested attributes and arrays.

Install
-------

Install with [bower](http://bower.io/) `bower install jquery.serializeToJSON`, or [npm](https://www.npmjs.com/) `npm install jquery-serializetojson'`, or just download the [jquery.serializetojson.js](https://github.com/raphaelm22/jquery.serializeToJSON/raw/master/src/jquery.serializeToJson.js) script.

And make sure it is included after jQuery, for example:
```html
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="jquery.serializeToJSON.js"></script>
```

Usage Example
-------------

HTML form (input, textarea and select tags supported):

```html
<!-- Example of form similar to Razor (ASP MVC) -->
<form id="myForm">
	<div class="form-group">
		<label>Name</label>
		<input type="text" name="Customer.FullName" class="form-control" />
	</div>
	<div class="form-group">
		<label>e-mail</label>
		<input type="text" name="Customer.Email" class="form-control" />
	</div>
	<div class="form-group">
		<label>Payment</label>
		<select name="Payment" class="form-control">
			<option value="">Select payment...</option>
			<option value="1">Credit Card</option>
			<option value="2">Cash</option>
		</select>
	</div>
	<div class="form-group">
		<label>Credit Card Company</label>
		<select name="CreditCardCompany" multiple class="form-control">
			<option value="Company A">Company A</option>
			<option value="Company B">Company B</option>
			<option value="Company C">Company C</option>
		</select>
	</div>
	
	<div class="form-group">
		<label>New Customer?</label>
		<div class="radio">
			<label>
				<input type="radio" name="IsNewCustomer" value="True" /> Yes
			</label>
			<label>
				<input type="radio" name="IsNewCustomer" value="False" /> No
			</label>
		</div>
	</div>
	<div class="form-group">
		<label>Marketing: </label>
		<div class="checkbox">
			<label>
				<input type="checkbox" name="ReceiveEmailPartner" value="true" /> You agree to receive e-mail partner?
				<input type="hidden" name="ReceiveEmailPartner" value="false" />
			</label>
			<label>
				<input type="checkbox" name="ReceiveSMSPartner" value="true" /> You agree to receive SMS partner?
				<input type="hidden" name="ReceiveSMSPartner" value="false" />
			</label>
		</div>
	</div>
	<table>
		<thead>
			<tr>
				<th>Product ID</th>
				<th>Name</th>
				<th>Quantity</th>
				<th>Cost</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input type="text" value="54457" name="Product[0].ID" class="number" /></td>
				<td><input type="text" value="Smartphone" name="Product[0].Name" /></td>
				<td><input type="text" value="5" name="Product[0].Quantity" class="number" /></td>
				<td><input type="text" value="1,054.99" name="Product[0].Cost" class="money" /></td>
			</tr>
			<tr>
				<td><input type="text" value="97518" name="Product[1].ID" class="number" /></td>
				<td><input type="text" value="iPad" name="Product[1].Name" /></td>
				<td><input type="text" value="3" name="Product[1].Quantity" class="number" /></td>
				<td><input type="text" value="2,119.99" name="Product[1].Cost" class="money" /></td>
			</tr>
		</tbody>
	</table>
</form>

```

JavaScript:

```javascript
var obj = $("#myForm").serializeToJSON({
				parseFloat: {
					condition: ".number,.money"
				}			
			});

// obj =>
{
  Customer: {
    FullName: "Raphael Nunes",
    Email: "myemail@gmail.com"
  },
  Payment: "1",
  CreditCardCompany: [
    "Company A",
    "Company C"
  ],
  IsNewCustomer: true,
  ReceiveEmailPartner: false,
  ReceiveSMSPartner: false,
  Product: {
    0: {
      ID: 54457,
      Name: "Smartphone",
      Quantity: 5,
	  Cost: 1,054.99
    },
    1: {
      ID: 97518,
      Name: "iPad",
      Quantity: 3,
	  Cost: 2,119.99
    }
  }
}

var objNotAssociativeArrays = $("#myForm").serializeToJSON({associativeArrays: false});
// objNotAssociativeArrays =>
{
  Customer: {
    "FullName": "Raphael Nunes",
    "Email": "myemail@gmail.com"
  },
  Payment: "1",
  CreditCardCompany: [
    "Company A",
    "Company C"
  ],
  IsNewCustomer: true,
  ReceiveEmailPartner: false,
  ReceiveSMSPartner: false,
  Product: [
    {
      ID: "54457",
      Name: "Smartphone",
      Quantity: "5",
	  Cost: "1,054.99"
    },
    {
      ID: "97518",
      Name: "iPad",
      Quantity: "3",
	  Cost: "2,119.99"
    }
  ]
}
```

The function `serializeToJSON` return a JavaScript object, not a JSON string.

If you want a chain a JSON string then use `JSON.stringify`
To support old browsers, just include the [json2.js](https://github.com/douglascrockford/JSON-js) polyfill (as described on [stackoverfow](http://stackoverflow.com/questions/191881/serializing-to-json-in-jquery)).

```javascript
  var obj = $("#myForm").serializeToJSON();
  var jsonString = JSON.stringify(obj);
```

Note that `.serializeToJSON ()` uses the return of jQuery's method [.serializeArray ()] (https://api.jquery.com/serializeArray/) to create the serialized object.
So if the return is not desired, first check that that was returned by the [.serializeArray ()] (https://api.jquery.com/serializeArray/) method.


Options
-------

To change the default options, simply enter the desired options via parameter of the method `.serializeToJSON ()`.

To change the default behavior you use the following options:

  * **associativeArrays: true**, by default, the method does not serialize using the `Array` but `Associative Arrays`.
  
  * **parseBooleans: true**, automatically detect and convert strings `"true"` and `"false"` to booleans `true / false`.
  
  * **parseFloat.condition: undefined**, the value can be a `string` or `function`
  
  **`string`**: filter used in the function [`jQuery().is('condition')`] (http://api.jquery.com/is/) to detect and convert into float / number. Example: `".number"` or `"[mask='money']"`.
  
  **`function`**: the return of function sets when the convert occur. example:
```javascript
function(i) {
	var v = i.val().split(",").join("");
	return !isNaN(Number(v)); // In this case, conversion will always occur when possible
}
```
  
  * **parseFloat.nanToZero: true**, automatically detect `NaN` value and changes the value to zero.
  
  * **parseFloat.getInputValue: `function(){}`**, By default, returns the input value without commas, not an error occurs in conversion.
  if your location uses comma for decimal separation, for example in German or Brazil, you can change to: 
```javascript
function(i){ 
	return i.val().split(".").join("").replace(",", "."); 
}
```
  
  

## Defaults ##

All options defaults are defined in `$.serializeToJSON.defaultOptions`. You can just modify it to avoid setting the option on every call to `serializeToJSON`.

For example:

```javascript
$.fn.serializeToJSON.defaults.parseBooleans = false;     // not parse booleans by default
$.fn.serializeToJSON.defaults.associativeArrays = false; // not use associative array by default

$("#myForm").serializeToJSON(); // No options => then use $.fn.serializeToJSON.defaults
```

Contributions
-------------

Contributions are always welcome.


Author
-------

Written and maintained by [Raphael Nunes](https://github.com/raphaelm22)


