package com.mandvi.boardgameapp.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mandvi.boardgameapp.models.BoardGame;
import com.mandvi.boardgameapp.repositories.BoardGameRepository;

@Service
public class BoardGameService { 
	@Autowired
	private BoardGameRepository boardGameRepository;

	// ======FULL CRUD ======   
	    
	    // READ ALL
	    public List<BoardGame> allBoardGames() {
	        return boardGameRepository.findAll();
	    }
	    // CREATE
	    public BoardGame createBoardGame(BoardGame b) {
	        return boardGameRepository.save(b);
	    }
	    // READ ONE
	    public BoardGame findBoardGame(Long id) {
	        Optional<BoardGame> optionalBoardGame = boardGameRepository.findById(id);
	        
	        if(optionalBoardGame.isPresent()) {
	            return optionalBoardGame.get();
	        } else {
	            return null;
	        }
	    }
	    
	    // READ ONE
	    public BoardGame findBoardGame(String apiId) {
	        Optional<BoardGame> optionalBoardGame = boardGameRepository.findByApiId(apiId);
	        
	        if(optionalBoardGame.isPresent()) {
	            return optionalBoardGame.get();
	        } else {
	            return null;
	        }
	    }
	    
	    //UPDATE
	    public BoardGame updateBoardGame(BoardGame b) {
	    	BoardGame updateBoardGame = boardGameRepository.save(b);
	    	return updateBoardGame;
	    }
	    
	    //DELETE //deleteById returns void thats why void method
	    public void deleteBoardGame(Long id) {
	    	boardGameRepository.deleteById(id);
	    }

}
