using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebApplication2.Data;
using WebApplication2.Dtos;
using WebApplication2.Helpers;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    //osvezavamo last activ (u klasi helpers loguseractivity) kada god se uradi bilo koja metoda u ovom kontroleru
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UserController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUserId=int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _repo.GetUser(currentUserId);

            userParams.UserId = currentUserId;

            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }
              

            var users = await _repo.GetUsers(userParams);

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            foreach (var u in usersToReturn)
            {
                foreach (var us in users)
                {
                    if (us.Id == u.Id)
                    {
                        if (DateTime.Now.Month > us.DateOfBirth.Month)
                        {

                            u.Age = DateTime.Now.Year - us.DateOfBirth.Year;
                        }
                        else
                        {
                            if (DateTime.Now.Day > us.DateOfBirth.Day)
                            {
                                u.Age = DateTime.Now.Year - us.DateOfBirth.Year;
                            }
                            else
                            {
                                u.Age = DateTime.Now.Year - us.DateOfBirth.Year - 1;
                            }
                        }

                    }

                }
            }

            return Ok(usersToReturn);
        }

        [HttpGet("{id}",Name ="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);

            if (DateTime.Now.Month > user.DateOfBirth.Month)
            {

                userToReturn.Age = DateTime.Now.Year - user.DateOfBirth.Year;
            }
            else
            {
                if (DateTime.Now.Day > user.DateOfBirth.Day)
                {
                    userToReturn.Age = DateTime.Now.Year - user.DateOfBirth.Year;
                }
                else
                {
                    userToReturn.Age = DateTime.Now.Year - user.DateOfBirth.Year - 1;
                }
            }


            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id,UserForUpdateDto userForUpdateDto)
        {
            //proveravamo da li user koji je ulogovan pokusava da pristupi ruti i odradi put zahtev
            //proveravamo id koji je prosledjen sa tokenom
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(id);

            _mapper.Map(userForUpdateDto, userFromRepo);

            if(await _repo.SaveAll())
            {
                return NoContent();
            }

            throw new Exception($"Updating user with id: {id} failed on save");


        }

        [HttpPost("{id}/like/{recipientId}")]

        public async Task<IActionResult> LikeUser(int id,int recipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();


            var like = await _repo.GetLike(id, recipientId);

            if (like != null)
            {
                return BadRequest("You alredy liked this user");

            }

            if(await _repo.GetUser(recipientId) == null)
            {
                return NotFound();
            }

            like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };

            _repo.Add<Like>(like);

            if(await _repo.SaveAll())
            {
                return Ok();
            }

            return BadRequest("Failed to like user");
        }

        
    }
}
