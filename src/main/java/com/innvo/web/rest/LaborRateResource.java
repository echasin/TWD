package com.innvo.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.innvo.domain.LaborRate;
import com.innvo.repository.LaborRateRepository;
import com.innvo.repository.search.LaborRateSearchRepository;
import com.innvo.web.rest.util.HeaderUtil;
import com.innvo.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing LaborRate.
 */
@RestController
@RequestMapping("/api")
public class LaborRateResource {

    private final Logger log = LoggerFactory.getLogger(LaborRateResource.class);
        
    @Inject
    private LaborRateRepository laborRateRepository;
    
    @Inject
    private LaborRateSearchRepository laborRateSearchRepository;
    
    /**
     * POST  /labor-rates : Create a new laborRate.
     *
     * @param laborRate the laborRate to create
     * @return the ResponseEntity with status 201 (Created) and with body the new laborRate, or with status 400 (Bad Request) if the laborRate has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/labor-rates",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<LaborRate> createLaborRate(@Valid @RequestBody LaborRate laborRate) throws URISyntaxException {
        log.debug("REST request to save LaborRate : {}", laborRate);
        if (laborRate.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("laborRate", "idexists", "A new laborRate cannot already have an ID")).body(null);
        }
        LaborRate result = laborRateRepository.save(laborRate);
        laborRateSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/labor-rates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("laborRate", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /labor-rates : Updates an existing laborRate.
     *
     * @param laborRate the laborRate to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated laborRate,
     * or with status 400 (Bad Request) if the laborRate is not valid,
     * or with status 500 (Internal Server Error) if the laborRate couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/labor-rates",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<LaborRate> updateLaborRate(@Valid @RequestBody LaborRate laborRate) throws URISyntaxException {
        log.debug("REST request to update LaborRate : {}", laborRate);
        if (laborRate.getId() == null) {
            return createLaborRate(laborRate);
        }
        LaborRate result = laborRateRepository.save(laborRate);
        laborRateSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("laborRate", laborRate.getId().toString()))
            .body(result);
    }

    /**
     * GET  /labor-rates : get all the laborRates.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of laborRates in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/labor-rates",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<LaborRate>> getAllLaborRates(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of LaborRates");
        Page<LaborRate> page = laborRateRepository.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/labor-rates");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /labor-rates/:id : get the "id" laborRate.
     *
     * @param id the id of the laborRate to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the laborRate, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/labor-rates/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<LaborRate> getLaborRate(@PathVariable Long id) {
        log.debug("REST request to get LaborRate : {}", id);
        LaborRate laborRate = laborRateRepository.findOne(id);
        return Optional.ofNullable(laborRate)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /labor-rates/:id : delete the "id" laborRate.
     *
     * @param id the id of the laborRate to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/labor-rates/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteLaborRate(@PathVariable Long id) {
        log.debug("REST request to delete LaborRate : {}", id);
        laborRateRepository.delete(id);
        laborRateSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("laborRate", id.toString())).build();
    }

    /**
     * SEARCH  /_search/labor-rates?query=:query : search for the laborRate corresponding
     * to the query.
     *
     * @param query the query of the laborRate search
     * @return the result of the search
     */
    @RequestMapping(value = "/_search/labor-rates",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<LaborRate>> searchLaborRates(@RequestParam String query, Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to search for a page of LaborRates for query {}", query);
        Page<LaborRate> page = laborRateSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/labor-rates");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
