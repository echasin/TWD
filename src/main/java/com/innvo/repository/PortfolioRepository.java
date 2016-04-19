package com.innvo.repository;

import com.innvo.domain.Portfolio;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Portfolio entity.
 */
public interface PortfolioRepository extends JpaRepository<Portfolio,Long> {

}
