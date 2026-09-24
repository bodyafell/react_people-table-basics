import { useEffect, useState } from 'react';
import { Loader } from './components/Loader';
import { Person } from './types';
import { NavLink, useParams } from 'react-router-dom';
import { PersonLink } from './PersonLink';

const BASE_URL =
  'https://mate-academy.github.io/react_people-table/api/people.json';

const wait = (delay: number) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

const getPeople = (): Promise<Person[]> => {
  setTimeout;
  return wait(2000)
    .then(() => fetch(BASE_URL))
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    });
};

const getLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'has-background-warning' : '';

export const PeoplePage = () => {
  const { personSlug } = useParams<{ personSlug?: string }>();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getPeople()
      .then(data => {
        setPeople(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {loading && <Loader />}

          {error && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {!loading && !error && people.length === 0 && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {!loading && !error && people.length > 0 && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people.map(person => {
                  const mother = people.find(p => p.name === person.motherName);
                  const father = people.find(p => p.name === person.fatherName);

                  return (
                    <tr 
                      data-cy="person" 
                      className={person.slug === personSlug ? 'has-background-warning' : ''} 
                      key = {person.slug} >
                      <td>
                        <PersonLink person={person} />
                      </td>

                      <td>{person.sex}</td>
                      <td>{person.born}</td>
                      <td>{person.died}</td>
                      <td>
                        {mother ? (
                          <PersonLink person={mother} />
                        ) : (
                          person.motherName || '-'
                        )}
                      </td>

                      {/* 3. Батько: аналогічно */}
                      <td>
                        {father ? (
                          <PersonLink person={father} />
                        ) : (
                          person.fatherName || '-'
                        )}
                      </td>
                    </tr>
                  );


                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
};