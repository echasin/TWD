package com.innvo.repository;

import com.innvo.domain.Worklog;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Worklog entity.
 */
public interface WorklogRepository extends JpaRepository<Worklog,Long> {

}
