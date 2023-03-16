package com.mandvi.boardgameapp.controllers;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mandvi.boardgameapp.models.BoardGame;
import com.mandvi.boardgameapp.models.LoginUser;
import com.mandvi.boardgameapp.models.User;
import com.mandvi.boardgameapp.services.BoardGameService;
import com.mandvi.boardgameapp.services.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:3000" }, allowedHeaders = "*", allowCredentials = "true")
public class APIController {

	@Autowired
	private UserService userService;

	@Autowired
	private BoardGameService boardGameService;
	
	//Retrieve user for the purpose of conditional rendering
	@SuppressWarnings("rawtypes")
	@GetMapping("/user")
	public ResponseEntity apiGetUserById(HttpSession sesh) {
		Long userId = (Long) sesh.getAttribute("user_id");
		User currentUser = userService.findOne(userId);

		if (currentUser == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No currentUser");
		}
		return ResponseEntity.status(HttpStatus.OK).body(currentUser);
	}
	
	//Register a user
	@SuppressWarnings("rawtypes")
	@PostMapping("/register")
	public ResponseEntity apiRegisterUser(@Valid @RequestBody User newUser, BindingResult result, HttpSession session)
			throws URISyntaxException {
		User createUser = userService.register(newUser, result);
		if (result.hasErrors()) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result.getAllErrors());
		}
		session.setAttribute("user_id", createUser.getId());
		return ResponseEntity.status(HttpStatus.OK).body(createUser);
	}

	//Login a user
	@SuppressWarnings("rawtypes")
	@PostMapping("/login")
	public ResponseEntity apiLoginUser(@Valid @RequestBody LoginUser user, BindingResult result, HttpSession session)
			throws URISyntaxException {
		User loggedInUser = userService.login(user, result);
		if (result.hasErrors()) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result.getAllErrors());
		}
		session.setAttribute("user_id", loggedInUser.getId());
		return ResponseEntity.status(HttpStatus.OK).body(loggedInUser);

	}
	
	//Log out a user
	@SuppressWarnings("rawtypes")
	@GetMapping("/logout")
	public ResponseEntity deleteUser(HttpSession session) throws URISyntaxException {
		session.invalidate();
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	//Add items to shopping cart using a post request
	@SuppressWarnings("rawtypes")
	@PostMapping("/addToCart")
	public ResponseEntity addToCart(@Valid @RequestBody BoardGame boardGame, BindingResult result, HttpSession sesh)
			throws URISyntaxException {
		BoardGame boardGameToAdd = boardGameService.findBoardGame(boardGame.getApiId());
		if (boardGameToAdd == null) {
			boardGameToAdd = boardGameService.createBoardGame(boardGame);
		}
		Long userId = (Long) sesh.getAttribute("user_id");
		User thisUser = userService.findOne(userId);
		List<User> customers = boardGameToAdd.getCustomers();
		if (customers == null) {
			boardGameToAdd.setCustomers(new ArrayList<User>());
		}
		boardGameToAdd.getCustomers().add(thisUser);
		boardGameService.updateBoardGame(boardGameToAdd);

		if (result.hasErrors()) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result.getAllErrors());
		}
		return ResponseEntity.status(HttpStatus.OK).build();

	}
	
	//Display items in the shopping cart
	@SuppressWarnings("rawtypes")
	@GetMapping("/getCart")
	public ResponseEntity getGamesInCart(HttpSession sesh) {
		Long userId = (Long) sesh.getAttribute("user_id");
		User thisUser = userService.findOne(userId);
		List<BoardGame> listOfGamesInCart = thisUser.getBoardGamesInCart();
		return ResponseEntity.status(HttpStatus.ACCEPTED).body(listOfGamesInCart);
	}

	/// =======REMOVE boardGame from user list/ remove customers from board game
	@SuppressWarnings("rawtypes")
	@GetMapping("/removeCart/{boardGameId}")
	public ResponseEntity removeCart(@PathVariable("boardGameId") Long boardGameId, HttpSession session) {
		// 1. grab the current user logged in from session
		Long userId = (Long) session.getAttribute("user_id");
		// 2. find the user from the db using the id
		User thisLoggedInUser = userService.findOne(userId);
		// get the boardGame
		BoardGame thisBoardGame = boardGameService.findBoardGame(boardGameId);
		// The m:n connection
		thisBoardGame.getCustomers().remove(thisLoggedInUser);
		// SAVE It To Database
		boardGameService.updateBoardGame(thisBoardGame);
		return ResponseEntity.status(HttpStatus.OK).build();

	}

}
