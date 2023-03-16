package com.mandvi.boardgameapp.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.mandvi.boardgameapp.models.BoardGame;


@Repository
public interface BoardGameRepository extends CrudRepository<BoardGame, Long> {
	List<BoardGame> findAll();
	
	Optional<BoardGame> findByApiId(String apiId);


}

