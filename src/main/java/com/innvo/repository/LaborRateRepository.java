package com.innvo.repository;

import com.innvo.domain.LaborRate;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the LaborRate entity.
 */
public interface LaborRateRepository extends JpaRepository<LaborRate,Long> {

}
