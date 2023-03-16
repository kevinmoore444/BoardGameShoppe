package com.mandvi.boardgameapp.services;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.mandvi.boardgameapp.models.PaymentRequest;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;

@Service
public class PaymentService {
	
	
    @PostConstruct
    public void init() {
        Stripe.apiKey = "sk_test_51MjV3CAd4eDFN2xXCacLrEWHa9ieX1olF3okJHwksmME71pOCqeLRhXr4ACYOWAKzc92LCWHDn6mPFz1J0k84pWL00Wuy64UsX";
    }
	public String charge(PaymentRequest chargeRequest) throws StripeException {
		 Map<String, Object> chargeParams = new HashMap<>();
	     chargeParams.put("amount", chargeRequest.getAmount());
	     chargeParams.put("currency", PaymentRequest.Currency.INR);
	     chargeParams.put("source", chargeRequest.getToken().getId());
	     
		Charge charge = Charge.create(chargeParams);
		return charge.getId();
	}

}
