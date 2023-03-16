package com.mandvi.boardgameapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mandvi.boardgameapp.models.PaymentRequest;
import com.mandvi.boardgameapp.services.PaymentService;
import com.stripe.exception.StripeException;

@RestController
@RequestMapping("/payment")
public class PaymentController {
	
	@Autowired
	PaymentService service;

	//Post request to record a payment made using the Stripe components
	@PostMapping
	public ResponseEntity<String> completePayment(@RequestBody PaymentRequest request) throws StripeException {
		String chargeId= service.charge(request);
		return chargeId!=null? new ResponseEntity<String>(chargeId,HttpStatus.OK):
			new ResponseEntity<String>("Please check the credit card details entered",HttpStatus.BAD_REQUEST);
	}
	
	//Return error messages regarding payment process
	@ExceptionHandler
	public String handleError(StripeException ex) {
		return ex.getMessage();
	}

}
