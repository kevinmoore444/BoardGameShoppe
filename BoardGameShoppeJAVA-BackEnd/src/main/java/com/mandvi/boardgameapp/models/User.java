package com.mandvi.boardgameapp.models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotEmpty(message = "Please enter your first name!")
	@Size(min = 3, max = 30, message = "First name must be between 3 and 30 characters")
	private String firstName;
	
	@NotEmpty(message = "Please enter your last name!")
	@Size(min = 3, max = 30, message = "Last name must be between 3 and 30 characters")
	private String lastName;

	@NotEmpty(message = "Email is required!")
	@Email(message = "Please enter a valid email!")
	private String email;

	@NotEmpty(message = "Password is required!")
	@Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
	private String password;

	@Transient
	@NotEmpty(message = "Please confirm your password!")
	@Size(min = 8, max = 128, message = "Confirm Password must be between 8 and 128 characters")
	private String confirmPassword;
	
	@JsonIgnore
	@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "cart", 
        joinColumns = @JoinColumn(name = "user_id"), 
        inverseJoinColumns = @JoinColumn(name = "board_game_id")
    )
    private List<BoardGame> boardGamesInCart;

	public User() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}

	public List<BoardGame> getBoardGamesInCart() {
		return boardGamesInCart;
	}

	public void setBoardGamesInCart(List<BoardGame> boardGamesInCart) {
		this.boardGamesInCart = boardGamesInCart;
	}

	
	

}
