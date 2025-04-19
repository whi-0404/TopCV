package com.TopCV.service;

import com.TopCV.entity.Sequence;
import com.TopCV.exception.JobportalException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Component
public class SequenceGeneratorService {

    private static MongoOperations mongoOperations;

    @Autowired
    public SequenceGeneratorService(MongoOperations mongoOperations) {
        SequenceGeneratorService.mongoOperations = mongoOperations;
    }

    public static long generateSequence(String seqName) throws JobportalException {
        Sequence counter = mongoOperations.findAndModify(
                Query.query(Criteria.where("_id").is(seqName)),
                new Update().inc("seq", 1),
                FindAndModifyOptions.options().returnNew(true).upsert(true),
                Sequence.class);
        if (counter == null) {
            throw new JobportalException("Unable to generate sequence: " + seqName);
        }
        return counter.getSeq();
    }

    public static String generateOTP()
    {
        StringBuilder otp = new StringBuilder();
        SecureRandom random = new SecureRandom();
        for (int i = 0; i < 6; i++) {

            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}
