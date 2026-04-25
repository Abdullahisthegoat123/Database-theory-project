package com.cricmate.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cricmate.backend.model.Innings;

public interface InningsRepository extends JpaRepository<Innings, Integer> {
}