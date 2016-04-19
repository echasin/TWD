package com.innvo.repository;

import com.innvo.domain.Portfolio;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Portfolio entity.
 */
public interface PortfolioRepository extends JpaRepository<Portfolio,Long> {

    @Query("select distinct portfolio from Portfolio portfolio left join fetch portfolio.projects")
    List<Portfolio> findAllWithEagerRelationships();

    @Query("select portfolio from Portfolio portfolio left join fetch portfolio.projects where portfolio.id =:id")
    Portfolio findOneWithEagerRelationships(@Param("id") Long id);

}
