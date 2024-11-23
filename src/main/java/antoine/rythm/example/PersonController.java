package antoine.rythm.example;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class PersonController {
	private final PersonRepository personRepository;

	@GetMapping("/persons")
	public List<PersonEntity> getPersons() {
		personRepository.save(new PersonEntity(1, "Toto"));
		return personRepository.findAll();
	}

}
